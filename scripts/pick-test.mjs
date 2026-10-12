/** Clicks an ingredient tray and captures the whole pick cycle. */
import puppeteer from "puppeteer-core";

const OUT = process.argv[2] ?? "/tmp";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--hide-scrollbars", "--force-device-scale-factor=1"],
  defaultViewport: { width: 1500, height: 1200, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("EXCEPTION:", e.message));
page.on("console", (m) => {
  if (m.type() === "error" && !m.text().includes("404")) console.log("ERR:", m.text());
});

await page.goto("http://localhost:3210/order", { waitUntil: "networkidle0" });
await page.evaluate(() => {
  localStorage.setItem(
    "ropot.order.v1",
    JSON.stringify({
      brothId: "spicy-sichuan",
      spiceId: "medium",
      lines: [
        { ingredientId: "wagyu-beef", quantity: 2 },
        { ingredientId: "enoki", quantity: 1 },
        { ingredientId: "bok-choy", quantity: 1 },
        { ingredientId: "shiitake", quantity: 1 },
        { ingredientId: "udon", quantity: 1 },
      ],
      step: "pick",
      details: { name: "", mobile: "", locationId: "adelaide-cbd", time: "soon" },
      placed: false,
      orderRef: null,
    }),
  );
});
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  document.querySelector('svg[role="group"]').scrollIntoView({ block: "center" });
});
await new Promise((r) => setTimeout(r, 900));

// Find the wagyu tray and click its centre.
const box = await page.evaluate(() => {
  const el = [...document.querySelectorAll('[role="button"]')].find((n) =>
    (n.getAttribute("aria-label") ?? "").startsWith("Wagyu Beef"),
  );
  if (!el) return null;
  // The first circle is the focus ring, drawn concentric with the dish.
  const c = el.querySelector("circle");
  const r = c.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
if (!box) throw new Error("Wagyu tray not found");
console.log("clicking wagyu at", box);

await page.mouse.move(box.x, box.y);
await new Promise((r) => setTimeout(r, 450));
await (await page.$('svg[role="group"]')).screenshot({ path: `${OUT}/pick-0-hover.png` });
await page.mouse.click(box.x, box.y);

const frames = [250, 300, 350, 350, 350, 400];
for (let i = 0; i < frames.length; i += 1) {
  await new Promise((r) => setTimeout(r, frames[i]));
  const stage = await page.$('svg[role="group"]');
  await stage.screenshot({ path: `${OUT}/pick-${i + 1}.png` });
  const status = await page.evaluate(() =>
    [...document.querySelectorAll("span")]
      .map((s) => s.textContent)
      .filter((t) => t && /Picking|Carrying|Adding|added|Ready/.test(t))
      .slice(0, 3),
  );
  console.log(`frame ${i + 1}`, JSON.stringify(status));
}

await new Promise((r) => setTimeout(r, 900));
const result = await page.evaluate(() =>
  JSON.parse(localStorage.getItem("ropot.order.v1")).lines,
);
console.log("ORDER LINES:", JSON.stringify(result));
await (await page.$('svg[role="group"]')).screenshot({ path: `${OUT}/pick-final.png` });
await browser.close();
