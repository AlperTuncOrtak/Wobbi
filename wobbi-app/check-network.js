const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  page.on('request', request => {
    console.log('Fetching:', request.url());
    request.continue();
  });
  page.on('requestfailed', request => {
    console.log('Failed:', request.url(), request.failure().errorText);
  });

  try {
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 5000));
  } catch (err) {}
  
  await browser.close();
})();
