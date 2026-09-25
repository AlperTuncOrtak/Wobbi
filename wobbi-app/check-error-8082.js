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
  
  await page.evaluateOnNewDocument(() => {
    window.addEventListener('unhandledrejection', event => {
      console.log('UNHANDLED REJECTION:', event.reason ? (event.reason.message || event.reason) : event);
    });
    window.addEventListener('error', event => {
      console.log('WINDOW ERROR:', event.message);
    });
  });

  try {
    await page.goto('http://localhost:8082', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 5000));
  } catch (err) {
    console.log("Navigation Error:", err);
  }
  
  await browser.close();
})();
