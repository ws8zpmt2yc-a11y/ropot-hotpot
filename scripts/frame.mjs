/** Screenshots the station viewport (SVG + camera overlays). */
import puppeteer from "puppeteer-core";
const OUT = process.argv[2];
const MID_PICK = process.argv[3] === "pick";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new", args: ["--hide-scrollbars"],
  defaultViewport: { width: 1500, height: 1200 },
});
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("EXCEPTION:", e.message));
await page.goto("http://localhost:3210/order", { waitUntil: "networkidle0" });
await page.evaluate(() => localStorage.setItem("ropot.order.v1", JSON.stringify({
  brothId: "spicy-sichuan", spiceId: "medium",
  lines: [
    { ingredientId: "wagyu-beef", quantity: 2 },
    { ingredientId: "bok-choy", quantity: 1 },
    { ingredientId: "shiitake", quantity: 1 },
    { ingredientId: "corn", quantity: 1 },
    { ingredientId: "udon", quantity: 1 },
  ],
  step: "pick",
  details: { name: "", mobile: "", locationId: "adelaide-cbd", time: "s" },
  placed: false, orderRef: null })));
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  document.querySelector("[data-station-viewport]").scrollIntoView({ block: "center" });
});
await new Promise((r) => setTimeout(r, 1500));
const viewport = async () => page.$("[data-station-viewport]");

if (MID_PICK) {
  const box = await page.evaluate(() => {
    const el = [...document.querySelectorAll('[role="button"]')].find((n) =>
      (n.getAttribute("aria-label") ?? "").startsWith("Tiger Prawns"));
    const r = el.querySelector("circle").getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await page.mouse.move(box.x, box.y);
  await new Promise((r) => setTimeout(r, 500));
  await (await viewport()).screenshot({ path: `${OUT}/cam-hover.png` });
  await page.mouse.click(box.x, box.y);
  await new Promise((r) => setTimeout(r, 900));
  await (await viewport()).screenshot({ path: `${OUT}/cam-moving.png` });
} else {
  await (await viewport()).screenshot({ path: `${OUT}/cam-idle.png` });
}
console.log("ok");
await browser.close();
