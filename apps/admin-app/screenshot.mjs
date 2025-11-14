import { chromium } from '@playwright/test';

(async () => {
	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({
		viewport: { width: 1920, height: 1080 },
	});
	const page = await context.newPage();

	await page.goto('http://localhost:5173/dashboard');

	// Wait for page to load
	await page.waitForTimeout(2000);

	// Take screenshot of the top navigation area
	await page.screenshot({
		path: 'topnav-screenshot.png',
		fullPage: false,
	});

	console.log('Screenshots saved!');

	await browser.close();
})();
