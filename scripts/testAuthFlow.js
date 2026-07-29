import http from 'node:http';

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let respData = '';
      res.on('data', chunk => { respData += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(respData) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: respData });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting JJ Review System Auth Flow Verification Tests ---');

  const testHotel = 'sree-jee-stay';

  // Test 1: Verify default password (1234)
  console.log('\n[Test 1] Verifying initial password "1234"...');
  const t1 = await post('/api/auth/login', { hotelId: testHotel, password: '1234' });
  console.log('Result:', t1);
  if (t1.status !== 200 || !t1.data.success || !t1.data.accessToken) throw new Error('Test 1 failed');

  // Test 2: Verify wrong password
  console.log('\n[Test 2] Verifying wrong password "wrongpass"...');
  const t2 = await post('/api/auth/login', { hotelId: testHotel, password: 'wrongpass' });
  console.log('Result:', t2);
  if (t2.status !== 401 || t2.data.success) throw new Error('Test 2 failed');

  // Test 3: Change password to "5678" with wrong old password (should fail)
  console.log('\n[Test 3] Attempting password change with wrong old password...');
  const t3 = await post('/api/auth/change-password', { hotelId: testHotel, oldPassword: 'wrong', newPassword: '5678' });
  console.log('Result:', t3);
  if (t3.status !== 401 || t3.data.success) throw new Error('Test 3 failed');

  // Test 4: Change password to "5678" with correct old password "1234"
  console.log('\n[Test 4] Changing password from "1234" to "5678"...');
  const t4 = await post('/api/auth/change-password', { hotelId: testHotel, oldPassword: '1234', newPassword: '5678' });
  console.log('Result:', t4);
  if (t4.status !== 200 || !t4.data.success) throw new Error('Test 4 failed');

  // Test 5: Verify OLD password "1234" no longer works
  console.log('\n[Test 5] Confirming OLD password "1234" is rejected...');
  const t5 = await post('/api/auth/login', { hotelId: testHotel, password: '1234' });
  console.log('Result:', t5);
  if (t5.status !== 401 || t5.data.success) throw new Error('Test 5 failed');

  // Test 6: Verify NEW password "5678" works
  console.log('\n[Test 6] Confirming NEW password "5678" is accepted...');
  const t6 = await post('/api/auth/login', { hotelId: testHotel, password: '5678' });
  console.log('Result:', t6);
  if (t6.status !== 200 || !t6.data.success || !t6.data.accessToken) throw new Error('Test 6 failed');

  // Reset back to "1234"
  console.log('\n[Reset] Resetting password back to default "1234"...');
  await post('/api/auth/change-password', { hotelId: testHotel, oldPassword: '5678', newPassword: '1234' });

  console.log('\n🎉 ALL 6 VERIFICATION TESTS PASSED SUCCESSFULLY FOR JJ REVIEW SYSTEM!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
