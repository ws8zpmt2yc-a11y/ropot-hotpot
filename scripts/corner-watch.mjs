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
  brothId: "spicy-sichuan", spiceId: "medium", lines: [], step: "pick",
  details: { name: "", mobile: "", locationId: "adelaide-cbd", time: "s" },
  placed: false, orderRef: null })));
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  document.querySelector("[data-station-viewport]").scrollIntoView({ block: "center" });
});
// Catch a walker while it is inside the top-left quadrant of the frame.
for (let i = 0; i < 120; i++) {
  const inCorner = await page.evaluate(() => {
    const v = document.querySelector("[data-station-viewport]").getBoundingClientRect();
    const walkers = [...document.querySelectorAll("g")].filter(n => n.querySelector("animateMotion"));
    return walkers.some(w => {
      const r = w.getBoundingClientRect();
      if (!r.width) return false;
      const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      return cx < v.x + v.width * 0.45 && cy < v.y + v.height * 0.45;
    });
  });
  if (inCorner) {
    await (await page.$("[data-station-viewport]")).screenshot({ path: `${OUT}/corner-walker.png` });
    console.log("caught a walker in the top-left at poll", i);
    break;
  }
  await new Promise(r => setTimeout(r, 500));
}
await browser.close();
