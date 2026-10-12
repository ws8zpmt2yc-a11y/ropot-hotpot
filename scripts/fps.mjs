import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new", args: ["--hide-scrollbars"],
  defaultViewport: { width: 1500, height: 1100 },
});
const page = await browser.newPage();
await page.goto("http://localhost:3210/order", { waitUntil: "networkidle0" });
await page.evaluate(() => localStorage.setItem("ropot.order.v1", JSON.stringify({
  brothId: "spicy-sichuan", spiceId: "medium",
  lines: [{ ingredientId: "corn", quantity: 1 }], step: "pick",
  details: { name: "", mobile: "", locationId: "adelaide-cbd", time: "s" },
  placed: false, orderRef: null })));
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  document.querySelector("[data-station-viewport]").scrollIntoView({ block: "center" });
});
await new Promise(r => setTimeout(r, 1500));
// Send both arms out so the measurement covers the busiest case.
await page.evaluate(() => {
  const trays = [...document.querySelectorAll('[role="button"]')]
    .filter(n => (n.getAttribute("aria-label") ?? "").match(/^(Wagyu|Bok Choy)/));
  trays.forEach(t => t.dispatchEvent(new MouseEvent("click", { bubbles: true })));
});
const fps = await page.evaluate(() => new Promise(resolve => {
  let frames = 0;
  const start = performance.now();
  const tick = () => {
    frames++;
    if (performance.now() - start < 3000) requestAnimationFrame(tick);
    else resolve(Math.round(frames / ((performance.now() - start) / 1000)));
  };
  requestAnimationFrame(tick);
}));
console.log("fps while both arms are working:", fps);
await browser.close();
