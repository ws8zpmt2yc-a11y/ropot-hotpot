/**
 * Development screenshot helper.
 *   node scripts/shot.mjs <path> <out.png> [width] [height] [--state=<json>] [--scroll=<px>] [--click=<selector>] [--wait=<ms>]
 */
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const flags = Object.fromEntries(
  args
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const i = a.indexOf("=");
      return i === -1 ? [a.slice(2), "true"] : [a.slice(2, i), a.slice(i + 1)];
    }),
);

const [path = "/", out = "shot.png", width = "1440", height = "900"] = positional;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--force-device-scale-factor=1"],
  defaultViewport: { width: Number(width), height: Number(height) },
});

const page = await browser.newPage();
page.on("console", (m) => {
  if (m.type() === "error") console.log("PAGE ERROR:", m.text());
});
page.on("pageerror", (e) => console.log("PAGE EXCEPTION:", e.message));

await page.goto("http://localhost:3210" + path, { waitUntil: "networkidle0" });

if (flags.state) {
  await page.evaluate((s) => {
    localStorage.setItem("ropot.order.v1", s);
  }, flags.state);
  await page.reload({ waitUntil: "networkidle0" });
}

await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  const n = document.querySelector("nextjs-portal");
  if (n) n.remove();
});

if (flags.click) {
  await page.click(flags.click);
}

if (flags.scroll) {
  const target = flags.scroll;
  await page.evaluate((value) => {
    if (value.startsWith("#") || value.startsWith(".") || value.startsWith("[")) {
      const el = document.querySelector(value);
      if (el) window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 90);
    } else {
      window.scrollTo(0, Number(value));
    }
  }, target);
}

await new Promise((r) => setTimeout(r, Number(flags.wait ?? 1200)));
await page.screenshot({ path: out, fullPage: flags.full === "true" });
console.log("wrote", out);
await browser.close();
