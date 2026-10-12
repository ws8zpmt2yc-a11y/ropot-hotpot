import puppeteer from "puppeteer-core";
const OUT = process.argv[2];
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new", args: ["--hide-scrollbars"],
  defaultViewport: { width: 1500, height: 1200 },
});
const page = await browser.newPage();
await page.goto("http://localhost:3210/order", { waitUntil: "networkidle0" });
await page.evaluate(() => localStorage.setItem("ropot.order.v1", JSON.stringify({
  brothId: "spicy-sichuan", spiceId: "medium",
  lines: [{ ingredientId: "corn", quantity: 1 }, { ingredientId: "wagyu-beef", quantity: 1 }],
  step: "pick", details: { name: "", mobile: "", locationId: "adelaide-cbd", time: "s" },
  placed: false, orderRef: null })));
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  document.querySelector("[data-station-viewport]").scrollIntoView({ block: "center" });
});
// Wait for a walker to appear, then catch it partway across.
for (let i = 0; i < 40; i++) {
  const has = await page.evaluate(() => document.querySelectorAll("animateMotion").length > 0);
  if (has) break;
  await new Promise(r => setTimeout(r, 500));
}
await new Promise(r => setTimeout(r, 2200));
await (await page.$("[data-station-viewport]")).screenshot({ path: `${OUT}/walker.png` });
console.log("captured");
await browser.close();
