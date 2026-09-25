const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  try {
    await page.goto('http://localhost:8081', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 5000));
  } catch (err) {
    console.log("Navigation Error:", err);
  }
  
  await browser.close();
})();
