import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../server/config/db.js';
import { Hotel, Settings, User, Keyword, QrCode, Feedback } from '../server/models/index.js';
import { onboardHotel, getHotel } from '../server/services/hotelService.js';
import { getSettings, updateSettings, getKeywords, addKeyword, deleteKeyword } from '../server/services/settingsService.js';
import { login, changePassword } from '../server/services/authService.js';
import { getOrCreateQrToken, logScanEvent } from '../server/services/qrService.js';
import { generateAccessToken, verifyAccessToken } from '../server/utils/tokenHelper.js';

dotenv.config();

async function runIsolationTestSuite() {
  console.log('====================================================');
  console.log('🧪 JJ REVIEW SYSTEM — AUTOMATED MULTI-TENANT ISOLATION TEST');
  console.log('====================================================\n');

  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Failed to connect to MongoDB Atlas. Cannot execute test suite.');
    process.exit(1);
  }

  const timestamp = Date.now().toString(36);
  const hotelASlug = `test-alpha-${timestamp}`;
  const hotelBSlug = `test-beta-${timestamp}`;
  const hotelCSlug = `test-gamma-${timestamp}`;

  try {
    // ----------------------------------------------------
    // TEST 1: ONBOARD 3 INDEPENDENT HOTELS
    // ----------------------------------------------------
    console.log('📌 Test 1: Onboarding 3 Independent Hotels...');
    
    const hotelA = await onboardHotel({
      name: 'Hotel Alpha Resort',
      hotelSlug: hotelASlug,
      googlePlaceId: 'ChIJAlpha1111111111111111111',
      googleReviewUrl: `https://search.google.com/local/writereview?placeid=ChIJAlpha1111111111111111111`,
      managerEmail: `manager@alpha-${timestamp}.com`,
      password: 'AlphaPass123!',
    });
    console.log(`  ✅ Hotel A Onboarded: "${hotelA.hotel.name}" (Slug: ${hotelA.hotel.hotelSlug})`);

    const hotelB = await onboardHotel({
      name: 'Hotel Beta Inn',
      hotelSlug: hotelBSlug,
      googlePlaceId: 'ChIJBeta2222222222222222222',
      googleReviewUrl: `https://search.google.com/local/writereview?placeid=ChIJBeta2222222222222222222`,
      managerEmail: `manager@beta-${timestamp}.com`,
      password: 'BetaPass123!',
    });
    console.log(`  ✅ Hotel B Onboarded: "${hotelB.hotel.name}" (Slug: ${hotelB.hotel.hotelSlug})`);

    const hotelC = await onboardHotel({
      name: 'Hotel Gamma Suites',
      hotelSlug: hotelCSlug,
      googlePlaceId: 'ChIJGamma333333333333333333',
      googleReviewUrl: `https://search.google.com/local/writereview?placeid=ChIJGamma333333333333333333`,
      managerEmail: `manager@gamma-${timestamp}.com`,
      password: 'GammaPass123!',
    });
    console.log(`  ✅ Hotel C Onboarded: "${hotelC.hotel.name}" (Slug: ${hotelC.hotel.hotelSlug})\n`);

    // ----------------------------------------------------
    // TEST 2: VERIFY GOOGLE REVIEW URL ISOLATION
    // ----------------------------------------------------
    console.log('📌 Test 2: Verifying Google Review URL Isolation...');
    const settingsA = await getSettings(hotelASlug);
    const settingsB = await getSettings(hotelBSlug);
    const settingsC = await getSettings(hotelCSlug);

    if (settingsA.googleReviewUrl.includes('Alpha') &&
        settingsB.googleReviewUrl.includes('Beta') &&
        settingsC.googleReviewUrl.includes('Gamma') &&
        settingsA.googleReviewUrl !== settingsB.googleReviewUrl) {
      console.log('  ✅ Google Review URLs are 100% isolated and unique per hotel.');
    } else {
      throw new Error(`Google Review URL leakage detected! A: ${settingsA.googleReviewUrl}, B: ${settingsB.googleReviewUrl}`);
    }

    // ----------------------------------------------------
    // TEST 3: VERIFY KEYWORD MUTATION ISOLATION
    // ----------------------------------------------------
    console.log('\n📌 Test 3: Verifying Keyword Isolation & Mutations...');
    await addKeyword(hotelASlug, 'positive', { label: 'Alpha Exclusive Sunset View', tagId: 'tag_alpha_sunset' });
    await addKeyword(hotelBSlug, 'positive', { label: 'Beta Exclusive Infinity Pool', tagId: 'tag_beta_pool' });

    const keywordsA = await getKeywords(hotelASlug);
    const keywordsB = await getKeywords(hotelBSlug);

    const hasSunsetInA = keywordsA.positive.some(k => k.label.includes('Alpha Exclusive Sunset View'));
    const hasSunsetInB = keywordsB.positive.some(k => k.label.includes('Alpha Exclusive Sunset View'));

    if (hasSunsetInA && !hasSunsetInB) {
      console.log('  ✅ Keyword added to Hotel A appears ONLY in Hotel A and NOT in Hotel B.');
    } else {
      throw new Error('Keyword cross-tenant leakage detected!');
    }

    // ----------------------------------------------------
    // TEST 4: QR CODE GENERATION & RESOLUTION ISOLATION
    // ----------------------------------------------------
    console.log('\n📌 Test 4: Verifying QR Code Generation & Routing...');
    const qrA = await getOrCreateQrToken(hotelASlug);
    const qrB = await getOrCreateQrToken(hotelBSlug);

    if (qrA.uniqueToken !== qrB.uniqueToken) {
      console.log(`  ✅ Distinct QR Tokens Generated: A=${qrA.uniqueToken}, B=${qrB.uniqueToken}`);
    } else {
      throw new Error('Duplicate QR Token generated across hotels!');
    }

    const mockReqA = { headers: { host: 'localhost:8080' }, socket: { remoteAddress: '127.0.0.1' } };
    const scanResultA = await logScanEvent(qrA.uniqueToken, mockReqA);

    if (scanResultA && scanResultA.hotelSlug === hotelASlug) {
      console.log(`  ✅ QR Scan for token "${qrA.uniqueToken}" resolved strictly to "${scanResultA.hotelSlug}".`);
    } else {
      throw new Error(`QR Resolution error: token "${qrA.uniqueToken}" resolved to "${scanResultA?.hotelSlug}" instead of "${hotelASlug}".`);
    }

    // ----------------------------------------------------
    // TEST 5: AUTHENTICATION & JWT TOKEN SCOPING
    // ----------------------------------------------------
    console.log('\n📌 Test 5: Verifying Authentication & JWT Token Scoping...');
    const authA = await login(hotelASlug, 'AlphaPass123!');
    const decodedA = verifyAccessToken(authA.accessToken);

    if (decodedA.hotelId === hotelASlug && decodedA.hotelSlug === hotelASlug) {
      console.log(`  ✅ JWT Access Token properly scoped to hotelId="${decodedA.hotelId}".`);
    } else {
      throw new Error(`JWT Token hotelId mismatch! Payload: ${JSON.stringify(decodedA)}`);
    }

    // Attempting login with incorrect password
    try {
      await login(hotelASlug, 'WrongPassword!');
      throw new Error('Login with incorrect password should have failed!');
    } catch (err) {
      if (err.statusCode === 401) {
        console.log('  ✅ Login with incorrect password correctly rejected (401).');
      } else {
        throw err;
      }
    }

    // Attempting login with master PIN 9008 should fail if actual password is different
    try {
      await login(hotelASlug, '9008');
      throw new Error('Master PIN 9008 bypass allowed unauthorized login!');
    } catch (err) {
      if (err.statusCode === 401) {
        console.log('  ✅ Master PIN 9008 bypass is completely DISABLED.');
      } else {
        throw err;
      }
    }

    // ----------------------------------------------------
    // TEST 6: PASSWORD UPDATE & SESSION REVOCATION
    // ----------------------------------------------------
    console.log('\n📌 Test 6: Verifying Password Change & Cross-Device Session Revocation...');
    await changePassword(hotelASlug, 'AlphaPass123!', 'NewAlphaPass456!');
    console.log('  ✅ Password updated successfully for Hotel A.');

    // Old token should be rejected due to tokenVersion increment
    const userA = await User.findOne({ hotelId: hotelASlug });
    if (userA.tokenVersion > decodedA.tokenVersion) {
      console.log(`  ✅ User tokenVersion incremented from ${decodedA.tokenVersion} to ${userA.tokenVersion}. All old sessions invalidated.`);
    } else {
      throw new Error('tokenVersion was not incremented on password change!');
    }

    // ----------------------------------------------------
    // TEST 7: ATOMIC CLEANUP OF TEST DATA
    // ----------------------------------------------------
    console.log('\n📌 Test 7: Performing Atomic Cleanup of Test Records...');
    const deleteFilter = { hotelId: { $in: [hotelASlug, hotelBSlug, hotelCSlug] } };
    await Promise.all([
      Hotel.deleteMany(deleteFilter),
      Settings.deleteMany(deleteFilter),
      User.deleteMany(deleteFilter),
      Keyword.deleteMany(deleteFilter),
      QrCode.deleteMany(deleteFilter),
      Feedback.deleteMany(deleteFilter),
    ]);
    console.log('  ✅ All temporary test records removed cleanly from Atlas.\n');

    console.log('====================================================');
    console.log('🎉 ALL MULTI-TENANT ISOLATION TESTS PASSED 100%!');
    console.log('====================================================');

  } catch (err) {
    console.error('\n❌ ISOLATION TEST FAILED:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

runIsolationTestSuite();
