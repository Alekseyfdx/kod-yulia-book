import { chromium, devices } from "playwright";
import { writeFile } from "node:fs/promises";

const url = process.env.MOBILE_TEST_URL ?? "https://kod-yulia-book-edition-4.vercel.app/";
const device = devices["Pixel 7"];
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
});

const context = await browser.newContext({
  ...device,
  viewport: { width: 412, height: 915 },
  locale: "ru-RU",
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Книга" }).click();

async function measure(label) {
  const metrics = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const overlay = dialog?.parentElement;
    const rect = dialog?.getBoundingClientRect();
    const overlayRect = overlay?.getBoundingClientRect();

    return {
      viewport: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        visualViewportHeight: window.visualViewport?.height ?? null,
      },
      dialog: rect ? { top: rect.top, bottom: rect.bottom, height: rect.height } : null,
      overlay: overlayRect ? { top: overlayRect.top, bottom: overlayRect.bottom, height: overlayRect.height } : null,
    };
  });

  const fits = Boolean(
    metrics.dialog &&
      metrics.overlay &&
      metrics.dialog.top >= metrics.overlay.top &&
      metrics.dialog.bottom <= metrics.overlay.bottom &&
      metrics.overlay.top >= 0 &&
      metrics.overlay.bottom <= metrics.viewport.innerHeight,
  );

  if (!fits) {
    throw new Error(`${label}: dialog escapes the visible viewport: ${JSON.stringify(metrics)}`);
  }

  return { label, fits, ...metrics };
}

const results = [];
results.push(await measure("Pixel 7 full viewport"));
await page.screenshot({ path: "/home/ubuntu/kod-yulia-book/mobile-safe-area-full.png", fullPage: false });

await page.setViewportSize({ width: 412, height: 670 });
await page.waitForTimeout(250);
results.push(await measure("Pixel 7 reduced visual viewport"));
await page.screenshot({ path: "/home/ubuntu/kod-yulia-book/mobile-safe-area-reduced.png", fullPage: false });

await writeFile(
  "/home/ubuntu/kod-yulia-book/mobile-safe-area-results.json",
  `${JSON.stringify(results, null, 2)}\n`,
);
console.log(JSON.stringify(results, null, 2));
await browser.close();
