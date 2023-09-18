import { test, expect } from "@playwright/test";

test("Can replace a variable", async ({ page }) => {
  await page.goto("/");

  await page.locator("#template").fill("Hi ${name}, welcome to ${site}!");

  await page.locator("#entries #$name").fill("thomas\nstock");
  await page.locator("#entries #$site").fill("google\nfacebook\nnetflix");

  expect(await page.locator("#result").textContent()).toBe(
    `Hi thomas, welcome to google!\nHi stock, welcome to facebook!\nHi , welcome to netflix!`
  );
});
