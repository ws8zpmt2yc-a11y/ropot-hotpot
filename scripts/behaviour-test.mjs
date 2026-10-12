/** Keyboard access, rapid queueing, reduced motion and checkout. */
import puppeteer from "puppeteer-core";
const EXEC = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_STATE = (over = {}) => JSON.stringify({
  brothId: "spicy-sichuan", spiceId: "medium", lines: [], step: "pick",
  details: { name: "", mobile: "", locationId: "adelaide-cbd", time: "In 30 minutes" },
  placed: false, orderRef: null, ...over,
});

async function open(reduced, state = BASE_STATE()) {
  const browser = await puppeteer.launch({
    executablePath: EXEC, headless: "new", args: ["--hide-scrollbars"],
    defaultViewport: { width: 1400, height: 1000 },
  });
  const page = await browser.newPage();
  if (reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  page.on("pageerror", (e) => console.log("  EXCEPTION:", e.message));
  await page.goto("http://localhost:3210/order", { waitUntil: "networkidle0" });
  await page.evaluate((s) => localStorage.setItem("ropot.order.v1", s), state);
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });
  return { browser, page };
}
const lines = (page) => page.evaluate(() =>
  JSON.parse(localStorage.getItem("ropot.order.v1")).lines);
const trayPoint = (page, name) => page.evaluate((n) => {
  const el = [...document.querySelectorAll('[role="button"]')].find((x) =>
    (x.getAttribute("aria-label") ?? "").startsWith(n));
  if (!el) return null;
  el.scrollIntoView({ block: "center" });
  const r = el.querySelector("circle").getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
}, name);

// --- 1. Rapid clicks queue and both arms get used ---
{
  const { browser, page } = await open(false);
  await new Promise((r) => setTimeout(r, 900));
  for (const name of ["Wagyu Beef", "Bok Choy", "Enoki", "Udon", "Sweet Corn"]) {
    const p = await trayPoint(page, name);
    await page.mouse.click(p.x, p.y);
    await new Promise((r) => setTimeout(r, 120));
  }
  // innerText reflects the CSS uppercase transform.
  const queued = await page.evaluate(() =>
    document.body.innerText.match(/(\d+) in the queue/i)?.[1] ?? "none");
  await new Promise((r) => setTimeout(r, 9000));
  const result = await lines(page);
  const total = result.reduce((s, l) => s + l.quantity, 0);
  console.log(`1. rapid clicks -> queue chip showed "${queued}", delivered ${total}/5`,
    total === 5 && queued !== "none" ? "PASS" : "FAIL");
  await browser.close();
}

// --- 2. Keyboard: tab to a tray and press Enter ---
{
  const { browser, page } = await open(false);
  await new Promise((r) => setTimeout(r, 900));
  const focused = await page.evaluate(() => {
    const el = [...document.querySelectorAll('[role="button"]')].find((x) =>
      (x.getAttribute("aria-label") ?? "").startsWith("Shiitake"));
    el.focus();
    return document.activeElement === el;
  });
  await page.keyboard.press("Enter");
  await new Promise((r) => setTimeout(r, 3200));
  const result = await lines(page);
  console.log(`2. keyboard -> focusable ${focused}, added`,
    JSON.stringify(result), result.some((l) => l.ingredientId === "shiitake") ? "PASS" : "FAIL");
  await browser.close();
}

// --- 3. Reduced motion: transfer without the full reach ---
{
  const { browser, page } = await open(true);
  await new Promise((r) => setTimeout(r, 900));
  const notice = await page.evaluate(() => document.body.innerText.includes("Reduced motion on"));
  const p = await trayPoint(page, "Tiger Prawns");
  await page.mouse.click(p.x, p.y);
  await new Promise((r) => setTimeout(r, 1400));
  const result = await lines(page);
  console.log(`3. reduced motion -> notice ${notice}, added`,
    JSON.stringify(result), result.some((l) => l.ingredientId === "prawns") ? "PASS" : "FAIL");
  await browser.close();
}

// --- 4. Checkout places the order ---
{
  const { browser, page } = await open(false, BASE_STATE({
    step: "details", lines: [{ ingredientId: "wagyu-beef", quantity: 1 }],
  }));
  await new Promise((r) => setTimeout(r, 700));
  await page.type('input[autocomplete="name"]', "Tom");
  await page.type('input[autocomplete="tel"]', "0400123456");
  await page.evaluate(() => {
    [...document.querySelectorAll("button")]
      .find((b) => b.textContent.includes("Place order")).click();
  });
  await new Promise((r) => setTimeout(r, 800));
  const text = await page.evaluate(() => document.body.innerText);
  // innerText reflects the CSS uppercase transform, so compare case-insensitively.
  const ok = /order in\./i.test(text) && /RP\d{4}/.test(text);
  console.log("4. checkout ->", ok ? "PASS" : "FAIL", text.match(/RP\d{4}/)?.[0] ?? "");
  await page.screenshot({ path: `${process.argv[2]}/confirmed.png` });
  await browser.close();
}

// --- 5. Draft survives a page change ---
{
  const { browser, page } = await open(false, BASE_STATE({
    lines: [{ ingredientId: "udon", quantity: 3 }],
  }));
  await new Promise((r) => setTimeout(r, 700));
  await page.goto("http://localhost:3210/menu", { waitUntil: "networkidle0" });
  await page.goto("http://localhost:3210/order", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 700));
  const result = await lines(page);
  const kept = result.find((l) => l.ingredientId === "udon")?.quantity === 3;
  console.log("5. draft persists ->", kept ? "PASS" : "FAIL", JSON.stringify(result));
  await browser.close();
}
