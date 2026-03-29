const { test, expect } = require('@playwright/test');

test('Lead form should submit successfully over HTTP with form-name (Final Validation)', async ({ page }) => {
    // Serving via http://localhost:3456 to avoid clashes
    const url = 'http://localhost:3456/';
    
    // Log all browser console logs to host console
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto(url);

    // Opening the modal
    const quoteButtons = page.locator('.quote-trigger');
    await quoteButtons.first().click();
    
    // Wait for modal to be visible
    await expect(page.locator('#leadModal')).toBeVisible();

    // Fill form fields
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="phone"]', '+123456789');
    await page.fill('input[name="car"]', 'Test Car 2024');
    await page.selectOption('select[name="service"]', 'Oil Change');
    await page.fill('textarea[name="description"]', 'Test Issue Description');

    const submitBtn = page.locator('#leadForm button[type="submit"]');

    // MOCK the POST request to "/"
    let intercepted = false;
    await page.route('**/*', async (route) => {
        const request = route.request();
        if (request.method() === 'POST') {
            const postData = request.postData();
            console.log('Intercepted POST to', request.url());
            console.log('Post Data:', postData);

            // Check if form-name is present (as desired for Netlify)
            if (postData && postData.includes('form-name=leads-form')) {
                intercepted = true;
                route.fulfill({
                    status: 200,
                    contentType: 'text/plain',
                    body: 'ok'
                });
            } else {
                route.fulfill({
                    status: 400,
                    contentType: 'text/plain',
                    body: 'Bad Request: Missing form-name'
                });
            }
        } else {
            route.continue();
        }
    });

    await submitBtn.click();

    // Verify it changed to 'DONE'
    await expect(submitBtn).toContainText('DONE', { timeout: 10000 });
    expect(intercepted).toBeTruthy();
});
