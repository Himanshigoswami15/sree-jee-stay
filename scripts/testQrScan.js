import { getOrCreateQrToken, logScanEvent } from '../server/services/qrService.js';

async function test() {
  console.log('--- Testing QR Code Generation & Scanning Resolution ---');

  // Test 1: Get/create QR token for jj-elevates
  const jjQr = await getOrCreateQrToken('jj-elevates');
  console.log('[Test 1] Generated QR token for jj-elevates:', jjQr.uniqueToken);
  if (!jjQr || !jjQr.uniqueToken) throw new Error('Failed to generate QR token for jj-elevates');

  // Test 2: Log scan event using uniqueToken
  const mockReq = { headers: { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)', 'x-forwarded-for': '127.0.0.1' }, socket: {} };
  const scanResult1 = await logScanEvent(jjQr.uniqueToken, mockReq);
  console.log('[Test 2] Scan result using token:', scanResult1);
  if (scanResult1.hotelSlug !== 'jj-elevates') throw new Error(`QR Scan resolution mismatch: expected jj-elevates, got ${scanResult1.hotelSlug}`);

  // Test 3: Log scan event using slug directly
  const scanResult2 = await logScanEvent('jj-elevates', mockReq);
  console.log('[Test 3] Scan result using slug directly:', scanResult2);
  if (scanResult2.hotelSlug !== 'jj-elevates') throw new Error(`QR Scan direct resolution mismatch: expected jj-elevates, got ${scanResult2.hotelSlug}`);

  console.log('\n🎉 ALL QR SCAN RESOLUTION TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}

test().catch(err => {
  console.error('❌ QR Scan Test Error:', err);
  process.exit(1);
});
