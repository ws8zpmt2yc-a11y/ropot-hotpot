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
  lines: [{ ingredientId: "corn", quantity: 1 }], step: "pick",
  details: { name: "", mobile: "", locationId: "adelaide-cbd", time: "s" },
  placed: false, orderRef: null })));
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  document.querySelector('svg[role="group"]').scrollIntoView({ block: "center" });
});
await new Promise((r) => setTimeout(r, 1300));
const box = await page.evaluate(() => {
  const el = [...document.querySelectorAll('[role="button"]')].find((n) =>
    (n.getAttribute("aria-label") ?? "").startsWith("Wagyu Beef"));
  const r = el.querySelector("circle").getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
await page.mouse.click(box.x, box.y);
// Poll for a ripple element and grab the frame the moment one exists.
for (let i = 0; i < 120; i += 1) {
  const has = await page.evaluate(() =>
    Boolean(document.querySelector('[style*="broth-ripple"]')));
  if (has) {
    await (await page.$("[data-station-viewport]")).screenshot({
      path: `${OUT}/ripple.png`,
    });
    console.log("captured ripple at poll", i);
    break;
  }
  await new Promise((r) => setTimeout(r, 40));
}
await browser.close();
