<script lang="ts">
  $: console.log("foo!!");

  let template = `INSERT INTO Customers (CustomerName, Country)
VALUES ('??name??', '??country??');`;

  let prefix = "??";
  let suffix = "??";

  const escape = (input: string) =>
    input
      .split("")
      .map((char) => `\\${char}`)
      .join("");

  const keyedRegex = (key: string) => new RegExp(`${escape(prefix)}${key}${escape(suffix)}`, "g");

  const keyedEntry = (key: string) => entries[key].split("\n");

  $: regex = `(?<=${escape(prefix)})(\\w+)(?=${escape(suffix)})`;

  $: entryKeys = template.match(new RegExp(regex, "g")) ?? [];

  let entries: Record<string, string> = { name: "John\nIgor", country: "USA\nUkraine" };

  let result = [];
  $: {
    result = [];
    const resultCount = Math.max(
      ...entryKeys.map((key) => {
        return keyedEntry(key).length;
      })
    );
    console.log(resultCount);
    for (let i = 0; i < resultCount; i++) {
      result[i] = template;
      for (const key in entries) {
        result[i] = result[i].replace(keyedRegex(key), keyedEntry(key)[i] || "");
      }
    }
  }
  $: resultString = result.join("\n\n");
  $: console.log(entries);
</script>

<div id="stringer" class="h-screen font-mono text-sm">
  <div class="bg-slate-300 h-1/3 flex flex-col p-4 resize-y overflow-auto">
    <h3 class="font-bold text-lg mb-2">Template</h3>
    <textarea id="template" class="grow p-4 resize-none" bind:value={template} />
    <div class="flex gap-6 mt-4">
      <div class="grow flex gap-4">
        <label for="prefix" class="p-1">Prefix:</label><input id="prefix" bind:value={prefix} class="grow p-1" />
      </div>
      <div class="grow flex gap-4">
        <label for="suffix" class="p-1">Suffix:</label><input id="suffix" bind:value={suffix} class="grow p-1" />
      </div>
    </div>
  </div>
  <div id="entries" class="bg-slate-200 resize-y overflow-auto h-1/3 flex gap-4 p-4">
    {#each entryKeys as key}
      <div class="grow flex flex-col">
        <h3 class="font-bold">{key}</h3>
        <textarea class="w-full grow p-2" bind:value={entries[key]} />
      </div>
    {/each}
  </div>
  <div id="output" class="w-full bg-slate-400 resize-y overflow-auto h-1/3 flex flex-col p-4">
    <h3 class="font-bold text-lg mb-2">Result</h3>
    <textarea id="template" class="grow p-4 resize-none" bind:value={resultString} />
  </div>
</div>
