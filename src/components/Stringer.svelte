<script lang="ts">
  import { stringerStore, defaultStringer } from "../code/stores";

  $: ({ template, prefix, suffix, entries } = $stringerStore);

  const escape = (input: string) =>
    input
      .split("")
      .map((char) => `\\${char}`)
      .join("");

  const keyedRegex = (key: string) => new RegExp(`${escape(prefix)}${key}${escape(suffix)}`, "g");

  const keyedEntry = (key: string) => entries[key].split("\n");

  $: regex = `(?<=${escape(prefix)})(\\w+)(?=${escape(suffix)})`;

  $: entryKeys = template.match(new RegExp(regex, "g")) ?? [];

  let result = [];
  $: {
    // Reset result to clear old values, dont remove this
    result = [];

    const resultCount = Math.max(
      ...entryKeys.map((key) => {
        return keyedEntry(key).length;
      })
    );
    for (let i = 0; i < resultCount; i++) {
      result[i] = template;
      for (const key in entries) {
        result[i] = result[i].replace(keyedRegex(key), keyedEntry(key)[i] || "");
      }
    }
  }
  $: resultString = result.join("\n\n");
</script>

<div id="stringer" class="h-screen font-mono text-sm">
  <div class="bg-slate-300 h-1/3 flex flex-col p-4 resize-y overflow-auto">
    <div class="flex justify-between">
      <h3 class="font-bold text-lg mb-2">Template</h3>
      <button on:click={() => stringerStore.set(defaultStringer)}>Reset to sample</button>
    </div>
    <textarea id="template" class="grow p-4 resize-none" bind:value={$stringerStore.template} />
    <div class="flex gap-6 mt-4">
      <div class="grow flex gap-4">
        <label for="prefix" class="p-1">Prefix:</label><input id="prefix" bind:value={$stringerStore.prefix} class="grow p-1" />
      </div>
      <div class="grow flex gap-4">
        <label for="suffix" class="p-1">Suffix:</label><input id="suffix" bind:value={$stringerStore.suffix} class="grow p-1" />
      </div>
    </div>
  </div>
  <div id="entries" class="bg-slate-200 resize-y overflow-auto h-1/3 flex gap-4 p-4">
    {#if !entryKeys.length}
      <div class="text-lg italic">
        <div>No keys found!</div>
        <div>Checked template for strings like <span class="font-semibold bg-slate-50 p-1">{prefix}name{suffix}</span></div>
      </div>
    {/if}
    {#each entryKeys as key}
      <div class="grow flex flex-col">
        <h3 class="font-bold">{key}</h3>
        <textarea class="w-full grow p-2 resize-none" bind:value={$stringerStore.entries[key]} />
      </div>
    {/each}
  </div>
  <div id="output" class="bg-slate-400 resize-y overflow-auto h-1/3 flex flex-col p-4 pb-2">
    <h3 class="font-bold text-lg mb-2">Result</h3>
    <textarea id="template" class="grow p-4 resize-none" bind:value={resultString} />
    <div class="pt-2">
      Source code @ <a target="_blank" href="https://github.com/ThomasStock/Stringer/blob/main/src/components/Stringer.svelte"
        >https://github.com/ThomasStock/Stringer</a
      >
    </div>
  </div>
</div>
