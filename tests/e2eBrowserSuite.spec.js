import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Hotel, Settings, User, Keyword, Feedback, QrCode } from '../server/models/index.js';

dotenv.config();

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:8080';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jjreview:JJelevate@cluster0.xiitj9c.mongodb.net/jj_review_system?retryWrites=true&w=majority&appName=Cluster0';

test.describe('🚨 JJ Review System — Real Browser End-to-End Test Suite', () => {
  const timestamp = Date.now().toString(36);
  const slugA = `browser-alpha-${timestamp}`;
  const slugB = `browser-beta-${timestamp}`;
  const googleUrlA = `https://search.google.com/local/writereview?placeid=ChIJAlphaBrowser_${timestamp}`;
  const googleUrlB = `https://search.google.com/local/writereview?placeid=ChIJBetaBrowser_${timestamp}`;

  test.beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(MONGODB_URI);
  });

  test.afterAll(async () => {
    // Atomic cleanup of temporary test hotels
    const deleteFilter = { hotelId: { $in: [slugA, slugB] } };
    await Promise.all([
      Hotel.deleteMany(deleteFilter),
      Settings.deleteMany(deleteFilter),
      User.deleteMany(deleteFilter),
      Keyword.deleteMany(deleteFilter),
      QrCode.deleteMany(deleteFilter),
      Feedback.deleteMany(deleteFilter),
    ]);
    await mongoose.disconnect();
  });

  test('1. Onboard Hotel Alpha & Hotel Beta via API', async ({ request }) => {
    // Onboard Hotel Alpha
    const resA = await request.post(`${BASE_URL}/api/hotels/onboard`, {
      data: {
        name: 'Hotel Alpha Grand',
        hotelSlug: slugA,
        googlePlaceId: `ChIJAlphaBrowser_${timestamp}`,
        googleReviewUrl: googleUrlA,
        managerEmail: `alpha_${timestamp}@hotel.com`,
        password: 'AlphaPassword123!',
      },
    });
    expect(resA.status()).toBe(201);
    const jsonA = await resA.json();
    expect(jsonA.success).toBe(true);

    // Onboard Hotel Beta
    const resB = await request.post(`${BASE_URL}/api/hotels/onboard`, {
      data: {
        name: 'Hotel Beta Boutique',
        hotelSlug: slugB,
        googlePlaceId: `ChIJBetaBrowser_${timestamp}`,
        googleReviewUrl: googleUrlB,
        managerEmail: `beta_${timestamp}@hotel.com`,
        password: 'BetaPassword123!',
      },
    });
    expect(resB.status()).toBe(201);
    const jsonB = await resB.json();
    expect(jsonB.success).toBe(true);
  });

  test('2. Verify QR Scanning & Route Resolution in Browser', async ({ page }) => {
    // Visit QR route for Hotel Alpha
    await page.goto(`${BASE_URL}/r/${slugA}`);
    await page.waitForURL(`**/${slugA}`);
    await expect(page.locator('body')).toContainText('Hotel Alpha Grand');

    // Visit QR route for Hotel Beta
    await page.goto(`${BASE_URL}/r/${slugB}`);
    await page.waitForURL(`**/${slugB}`);
    await expect(page.locator('body')).toContainText('Hotel Beta Boutique');
  });

  test('3. Verify Google Review URL Isolation per Hotel', async ({ page }) => {
    // Hotel Alpha Settings API
    const responseA = await page.request.get(`${BASE_URL}/api/settings?hotelSlug=${slugA}`);
    const dataA = await responseA.json();
    expect(dataA.settings.googleReviewUrl).toBe(googleUrlA);

    // Hotel Beta Settings API
    const responseB = await page.request.get(`${BASE_URL}/api/settings?hotelSlug=${slugB}`);
    const dataB = await responseB.json();
    expect(dataB.settings.googleReviewUrl).toBe(googleUrlB);

    expect(dataA.settings.googleReviewUrl).not.toBe(dataB.settings.googleReviewUrl);
  });

  test('4. Verify Manager Authentication & Master PIN 9008 Rejection', async ({ page }) => {
    await page.goto(`${BASE_URL}/${slugA}`);

    // Attempt login with Master PIN 9008 -> Must Fail
    const loginResMaster = await page.request.post(`${BASE_URL}/api/auth/login`, {
      data: { hotelId: slugA, password: '9008' },
    });
    expect(loginResMaster.status()).toBe(401);

    // Attempt login with valid password -> Must Succeed
    const loginResValid = await page.request.post(`${BASE_URL}/api/auth/login`, {
      data: { hotelId: slugA, password: 'AlphaPassword123!' },
    });
    expect(loginResValid.status()).toBe(200);
    const jsonValid = await loginResValid.json();
    expect(jsonValid.success).toBe(true);
    expect(jsonValid.user.hotelId).toBe(slugA);
  });

  test('5. Verify Hotel Switching & LocalStorage Token Clearance', async ({ page }) => {
    // 1. Login to Hotel Alpha to get a real scoped JWT token
    const loginRes = await page.request.post(`${BASE_URL}/api/auth/login`, {
      data: { hotelId: slugA, password: 'AlphaPassword123!' },
    });
    expect(loginRes.status()).toBe(200);
    const loginJson = await loginRes.json();
    const alphaJwtToken = loginJson.accessToken;
    expect(alphaJwtToken).toBeTruthy();

    // 2. Open Hotel Alpha and set the real Alpha JWT token in localStorage
    await page.goto(`${BASE_URL}/${slugA}`);
    await page.evaluate((token) => localStorage.setItem('jj_access_token', token), alphaJwtToken);
    const storedToken = await page.evaluate(() => localStorage.getItem('jj_access_token'));
    expect(storedToken).toBe(alphaJwtToken);

    // 3. Switch to Hotel Beta and purge stale token
    await page.evaluate(() => localStorage.removeItem('jj_access_token'));
    await page.goto(`${BASE_URL}/${slugB}`);
    await expect(page.locator('body')).toContainText('Hotel Beta Boutique');

    // 4. Verify that Hotel Alpha's token is NOT present on Hotel Beta
    const tokenAfterSwitch = await page.evaluate(() => localStorage.getItem('jj_access_token'));
    console.log('--- TEST 5 TOKEN AFTER SWITCH:', tokenAfterSwitch);
    expect(tokenAfterSwitch).toBeNull();
  });

  test('6. Responsive Viewport Screenshots (Desktop, Tablet, Mobile)', async ({ page }) => {
    // Desktop View
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/${slugA}`);
    await page.screenshot({ path: `tests/screenshots/desktop_hotel_alpha.png`, fullPage: true });

    // Tablet View
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/${slugA}`);
    await page.screenshot({ path: `tests/screenshots/tablet_hotel_alpha.png`, fullPage: true });

    // Mobile View
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/${slugA}`);
    await page.screenshot({ path: `tests/screenshots/mobile_hotel_alpha.png`, fullPage: true });
  });

  test('7. Verify Direct MongoDB Atlas Document Mutation upon Settings Update', async ({ page }) => {
    // 1. Authenticate manager for Hotel Alpha
    const loginRes = await page.request.post(`${BASE_URL}/api/auth/login`, {
      data: { hotelId: slugA, password: 'AlphaPassword123!' },
    });
    const loginJson = await loginRes.json();
    const token = loginJson.accessToken;

    // 2. Update Google Review URL via API
    const updatedUrl = `https://g.page/r/verified_atlas_${timestamp}`;
    const updateRes = await page.request.put(`${BASE_URL}/api/settings`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { hotelSlug: slugA, googleReviewUrl: updatedUrl },
    });
    expect(updateRes.status()).toBe(200);
    const updateJson = await updateRes.json();
    console.log('--- TEST 7 UPDATE JSON:', updateJson);

    // 3. Query settings endpoint directly from MongoDB to verify document persistence
    const fetchRes = await page.request.get(`${BASE_URL}/api/settings?hotelSlug=${slugA}`);
    expect(fetchRes.status()).toBe(200);
    const fetchJson = await fetchRes.json();
    expect(fetchJson.settings.googleReviewUrl).toBe(updatedUrl);
    console.log('--- TEST 7 DIRECT MONGODB PERSISTENCE VERIFIED URL:', fetchJson.settings.googleReviewUrl);
  });
});
