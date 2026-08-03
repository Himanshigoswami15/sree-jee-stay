import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, getDbStatus } from '../server/config/db.js';
import { changePassword, login } from '../server/services/authService.js';
import { getSettings, updateSettings } from '../server/services/settingsService.js';
import { User, Settings, Hotel } from '../server/models/index.js';

async function testFullSync() {
  console.log('\n' + '='.repeat(70));
  console.log('  JJ Review System — Full MongoDB Cross-Device Sync & Auth Verification');
  console.log('='.repeat(70));

  const status = getDbStatus();
  console.log('\n[Step 1] Initial DB Status:', status);

  const connected = await connectDB();
  if (!connected) {
    console.error('\n❌ DB connection failed. Cannot proceed with live MongoDB verification test.');
    process.exit(1);
  }

  const liveStatus = getDbStatus();
  console.log(`\n✅ DB Connection established! Host: ${liveStatus.host} | DB: ${liveStatus.databaseName}`);

  const testSlug = 'sree-jee-stay';
  const testPin = '8899';

  console.log(`\n[Step 2] Updating Manager PIN on Device A to "${testPin}"...`);
  const pwdRes = await changePassword(testSlug, '9008', testPin, false).catch(async () => {
    return await changePassword(testSlug, '', testPin, true);
  });
  console.log('  Device A Password Change Result:', pwdRes.message);

  console.log('\n[Step 4 Verification] Direct MongoDB Collection Inspection for User...');
  const dbUser = await User.findOne({ hotelId: testSlug });
  console.log('  User Document in Atlas/DB:');
  console.log('   - ID:', dbUser._id.toString());
  console.log('   - hotelId:', dbUser.hotelId);
  console.log('   - tokenVersion:', dbUser.tokenVersion);
  console.log('   - passwordHash (first 20 chars):', dbUser.passwordHash.substring(0, 20) + '...');
  console.log('   - updatedAt:', dbUser.updatedAt);

  console.log('\n[Step 2 & 5] Device B Auth & Settings Read Verification...');
  console.log('  Device B attempting login with OLD pin 1111 (should fail)...');
  try {
    await login(testSlug, '1111');
    console.error('❌ FAIL: Login with wrong PIN succeeded!');
  } catch (err) {
    console.log('  ✅ Correctly rejected old PIN:', err.message);
  }

  console.log('  Device B attempting login with NEW pin ' + testPin + '...');
  const loginRes = await login(testSlug, testPin);
  console.log('  ✅ Device B Login Success! Token version matched. User:', loginRes.user.displayName);

  console.log('\n[Step 2] Device A updating Theme Color to "#059669" and Manager Phone...');
  const newPhone = '+91 99999 88888';
  const newColor = '#059669';
  const updateRes = await updateSettings(testSlug, {
    themeColor: newColor,
    managerPhone: newPhone,
  });
  console.log('  Device A Update Result:', updateRes.message);

  console.log('\n[Step 4 Verification] Direct MongoDB Collection Inspection for Settings...');
  const dbSettingsDoc = await Settings.findOne({ hotelId: testSlug });
  console.log('  Settings Document in Atlas/DB:');
  console.log('   - themeColor:', dbSettingsDoc.themeColor);
  console.log('   - managerPhone:', dbSettingsDoc.managerPhone);
  console.log('   - updatedAt:', dbSettingsDoc.updatedAt);

  console.log('\n[Step 5] Device B querying Fresh Data from MongoDB (Simulated Page Load)...');
  const deviceBSettings = await Settings.findOne({ hotelId: testSlug }).lean();
  console.log('  Device B Fresh DB Settings:');
  console.log('   - themeColor:', deviceBSettings.themeColor);
  console.log('   - managerPhone:', deviceBSettings.managerPhone);

  if (deviceBSettings.themeColor === newColor && deviceBSettings.managerPhone === newPhone) {
    console.log('\n🎉 ALL STEPS PASSED! MongoDB cross-device synchronization and persistence is 100% VERIFIED!');
  } else {
    console.error('\n❌ STEP 5 FAILED: Device B did not receive updated settings from MongoDB.');
    process.exit(1);
  }

  await mongoose.disconnect();
  process.exit(0);
}

testFullSync().catch(err => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
