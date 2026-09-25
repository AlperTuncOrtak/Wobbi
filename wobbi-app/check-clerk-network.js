const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().includes('clerk')) {
      console.log('Fetching:', request.url());
    }
    request.continue();
  });
  page.on('requestfailed', request => {
    if (request.url().includes('clerk')) {
      console.log('Failed:', request.url(), request.failure()?.errorText);
    }
  });
  page.on('response', response => {
    if (response.url().includes('clerk')) {
      console.log('Response:', response.url(), response.status());
    }
  });

  try {
    await page.goto('http://localhost:8082', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 5000));
  } catch (err) {}
  
  await browser.close();
})();
