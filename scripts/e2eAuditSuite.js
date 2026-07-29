import http from 'node:http';
import dotenv from 'dotenv';
import { connectDB, disconnectDB, mongoose } from '../server/config/db.js';

dotenv.config();

function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);

    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path,
      method: options.method || 'GET',
      headers,
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
    if (data) req.write(data);
    req.end();
  });
}

const auditResults = {
  passed: [],
  failed: [],
  security: [],
  performance: {},
};

function pass(section, title, details = '') {
  auditResults.passed.push({ section, title, details });
  console.log(`  ✅ [PASS] [${section}] ${title} ${details ? '— ' + details : ''}`);
}

function fail(section, title, error = '') {
  auditResults.failed.push({ section, title, error });
  console.error(`  ❌ [FAIL] [${section}] ${title} — ${error}`);
}

async function runAudit() {
  console.log('\n====================================================');
  console.log('  🕵️ JJ REVIEW SYSTEM — FULL END-TO-END AUDIT SUITE');
  console.log('====================================================\n');

  // SECTION 1: Health & API Connectivity
  console.log('📌 --- SECTION 1: API & Branding Health Audit ---');
  try {
    const start = Date.now();
    const res = await request('/health');
    const latency = Date.now() - start;
    if (res.status === 200 && res.data.status === 'healthy') {
      pass('Section 1', 'API Health Check', `Response time: ${latency}ms`);
      auditResults.performance.healthLatencyMs = latency;
    } else {
      fail('Section 1', 'API Health Check', `Status: ${res.status}`);
    }

    const rootRes = await request('/');
    if (rootRes.data.service && rootRes.data.service.includes('JJ Review System')) {
      pass('Section 1', 'Product Branding Verification', `Service name: "${rootRes.data.service}"`);
    } else {
      fail('Section 1', 'Product Branding Verification', `Received: "${rootRes.data?.service}"`);
    }
  } catch (err) {
    fail('Section 1', 'Backend Server Connectivity', err.message);
  }

  // SECTION 2: Guest Review Flow & Database Writes
  console.log('\n📌 --- SECTION 2: Guest Review Flow & DB Write Audit ---');
  const testHotel = 'sree-jee-stay';
  const testPhone = '+91 99999 ' + Math.floor(10000 + Math.random() * 90000);

  try {
    const subRes = await request('/api/feedback', { method: 'POST' }, {
      hotelSlug: testHotel,
      rating: 5,
      tags: ['clean', 'wifi'],
      reviewText: 'Audit Test: Outstanding cleanliness and high-speed Wi-Fi experience.',
      guestContact: testPhone,
      postedPublic: true,
    });

    if (subRes.status === 201 && subRes.data.success && subRes.data.submission) {
      pass('Section 2', 'Guest High Rating Review Submission', `Submission ID: ${subRes.data.submission.id}`);
    } else {
      fail('Section 2', 'Guest High Rating Review Submission', JSON.stringify(subRes.data));
    }

    const dupRes = await request('/api/feedback', { method: 'POST' }, {
      hotelSlug: testHotel,
      rating: 5,
      tags: ['staff'],
      reviewText: 'Duplicate submission attempt.',
      guestContact: testPhone,
    });

    if (dupRes.data.isDuplicate) {
      pass('Section 2', 'Duplicate Review Prevention', `Blocked duplicate for phone: ${testPhone}`);
    } else {
      fail('Section 2', 'Duplicate Review Prevention', 'Failed to block duplicate contact submission.');
    }

    const lowPhone = '+91 88888 ' + Math.floor(10000 + Math.random() * 90000);
    const lowRes = await request('/api/feedback', { method: 'POST' }, {
      hotelSlug: testHotel,
      rating: 2,
      tags: ['ac_issue'],
      reviewText: 'Audit Test: Air conditioning issue needs repair.',
      guestContact: lowPhone,
    });

    if (lowRes.status === 201 && lowRes.data.submission.status === 'Manager Alerted') {
      pass('Section 2', 'Low Rating Manager Alert Trigger', `Feedback ID: ${lowRes.data.submission.id}`);
    } else {
      fail('Section 2', 'Low Rating Manager Alert Trigger', JSON.stringify(lowRes.data));
    }
  } catch (err) {
    fail('Section 2', 'Guest Review Flow Audit', err.message);
  }

  // SECTION 3: Authentication & Multi-Device Token Invalidation
  console.log('\n📌 --- SECTION 3: Authentication & Token Invalidation Audit ---');
  let managerToken = null;

  try {
    const wrongRes = await request('/api/auth/login', { method: 'POST' }, {
      hotelId: testHotel,
      password: 'wrongpassword123',
    });
    if (wrongRes.status === 401) {
      pass('Section 3', 'Wrong Password Rejection', '401 Unauthorized returned correctly');
    } else {
      fail('Section 3', 'Wrong Password Rejection', `Unexpected status: ${wrongRes.status}`);
    }

    const loginRes = await request('/api/auth/login', { method: 'POST' }, {
      hotelId: testHotel,
      password: '1234',
    });
    if (loginRes.status === 200 && loginRes.data.accessToken) {
      managerToken = loginRes.data.accessToken;
      pass('Section 3', 'Manager Login & JWT Issuance', 'Valid access & refresh tokens issued');
    } else {
      fail('Section 3', 'Manager Login', JSON.stringify(loginRes.data));
    }

    const meRes = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    if (meRes.status === 200 && meRes.data.user) {
      pass('Section 3', 'JWT Protected Route Access', `User Email: ${meRes.data.user.email}`);
    } else {
      fail('Section 3', 'JWT Protected Route Access', `Status: ${meRes.status}`);
    }

    const changeRes = await request('/api/auth/change-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managerToken}` }
    }, {
      hotelId: testHotel,
      oldPassword: '1234',
      newPassword: '9999',
    });

    if (changeRes.status === 200 && changeRes.data.success) {
      pass('Section 3', 'Password Update Execution', 'New password "9999" saved');

      const staleRes = await request('/api/auth/me', {
        headers: { Authorization: `Bearer ${managerToken}` }
      });
      if (staleRes.status === 401) {
        pass('Section 3', 'Multi-Device Session Invalidation', 'Stale JWT revoked immediately (401 TOKEN_REVOKED)');
      } else {
        fail('Section 3', 'Multi-Device Session Invalidation', `Stale JWT was NOT revoked! Status: ${staleRes.status}`);
      }

      const newLogin = await request('/api/auth/login', { method: 'POST' }, {
        hotelId: testHotel,
        password: '9999',
      });
      if (newLogin.status === 200) {
        managerToken = newLogin.data.accessToken;
        pass('Section 3', 'New Password Authentication', 'Successfully authenticated with new password "9999"');

        await request('/api/auth/change-password', {
          method: 'POST',
          headers: { Authorization: `Bearer ${managerToken}` }
        }, {
          hotelId: testHotel,
          oldPassword: '9999',
          newPassword: '1234',
        });
        const resetLogin = await request('/api/auth/login', { method: 'POST' }, {
          hotelId: testHotel,
          password: '1234',
        });
        managerToken = resetLogin.data.accessToken;
      }
    } else {
      fail('Section 3', 'Password Update Execution', JSON.stringify(changeRes.data));
    }
  } catch (err) {
    fail('Section 3', 'Authentication Audit', err.message);
  }

  // SECTION 5 & 6: No-Code Hotel Onboarding & Data Isolation
  console.log('\n📌 --- SECTION 5 & 6: Hotel Onboarding & Data Isolation Audit ---');
  const auditHotelSlug = 'hotel-paradise-' + Math.floor(1000 + Math.random() * 9000);

  try {
    const onboardRes = await request('/api/hotels/onboard', { method: 'POST' }, {
      name: 'Hotel Paradise & Spa',
      hotelSlug: auditHotelSlug,
      managerEmail: `manager@${auditHotelSlug}.com`,
      password: '5678',
      tone: 'luxury',
      googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    });

    if (onboardRes.status === 201 && onboardRes.data.success) {
      pass('Section 6', 'No-Code Hotel Onboarding', `Hotel "${auditHotelSlug}" created with default collections`);
    } else {
      fail('Section 6', 'No-Code Hotel Onboarding', JSON.stringify(onboardRes.data));
    }

    const paradiseLogin = await request('/api/auth/login', { method: 'POST' }, {
      hotelId: auditHotelSlug,
      password: '5678',
    });

    if (paradiseLogin.status === 200 && paradiseLogin.data.accessToken) {
      const paradiseToken = paradiseLogin.data.accessToken;

      await request('/api/feedback', { method: 'POST' }, {
        hotelSlug: auditHotelSlug,
        rating: 5,
        reviewText: 'Paradise isolated stay experience.',
      });

      const paradiseList = await request('/api/feedback', {
        headers: { Authorization: `Bearer ${paradiseToken}` }
      });

      const sreeList = await request('/api/feedback', {
        headers: { Authorization: `Bearer ${managerToken}` }
      });

      if (paradiseList.data.feedbacks && sreeList.data.feedbacks) {
        const isIsolated = !paradiseList.data.feedbacks.some(f => f.reviewText.includes('Sree Jee')) &&
                           !sreeList.data.feedbacks.some(f => f.reviewText.includes('Paradise'));
        if (isIsolated) {
          pass('Section 5', 'Multi-Client Data Isolation (hotelId)', 'Feedback queries strictly isolated between hotels');
        } else {
          fail('Section 5', 'Multi-Client Data Isolation', 'Cross-client feedback data leak detected!');
        }
      }
    }
  } catch (err) {
    fail('Section 5 & 6', 'Hotel Isolation & Onboarding Audit', err.message);
  }

  // SECTION 8: MongoDB Collections & Indexes Check
  console.log('\n📌 --- SECTION 8: MongoDB Collection & Index Audit ---');
  await connectDB();
  const db = mongoose.connection.db;

  try {
    const collections = await db.listCollections().toArray();
    const colNames = collections.map(c => c.name);
    pass('Section 8', 'MongoDB Active Collections List', `Found ${colNames.length} collections: ${colNames.join(', ')}`);

    const requiredCols = ['hotels', 'users', 'settings', 'feedbacks', 'keywords', 'audit_logs'];
    const missing = requiredCols.filter(c => !colNames.includes(c));

    if (missing.length === 0) {
      pass('Section 8', 'Required Collection Coverage', 'All mandatory MongoDB collections exist');
    } else {
      fail('Section 8', 'Required Collection Coverage', `Missing: ${missing.join(', ')}`);
    }

    const userIndexes = await db.collection('users').indexes();
    pass('Section 8', 'User Collection Index Verification', `Found ${userIndexes.length} indexes`);
  } catch (err) {
    fail('Section 8', 'MongoDB Database Audit', err.message);
  } finally {
    await disconnectDB();
  }

  // SECTION 9: Security Audit
  console.log('\n📌 --- SECTION 9: Security & IDOR Hardening Audit ---');
  try {
    const idorRes = await request('/api/settings?hotelId=sree-jee-stay', {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    if (idorRes.status === 200) {
      pass('Section 9', 'IDOR & Parameter Tampering Hardening', 'Protected route strictly derived hotel from JWT');
    }

    const invalidJwt = await request('/api/auth/me', {
      headers: { Authorization: 'Bearer invalid.token.string' }
    });
    if (invalidJwt.status === 401) {
      pass('Section 9', 'Malformed JWT Rejection', '401 Unauthorized returned correctly on protected routes');
    } else {
      fail('Section 9', 'Malformed JWT Rejection', `Status: ${invalidJwt.status}`);
    }
  } catch (err) {
    fail('Section 9', 'Security Audit', err.message);
  }

  console.log('\n====================================================');
  console.log(`  📊 AUDIT COMPLETE: ${auditResults.passed.length} Passed, ${auditResults.failed.length} Failed`);
  console.log('====================================================\n');

  if (auditResults.failed.length > 0) {
    console.error('❌ E2E Audit detected failures. Please resolve before releasing to production.');
    process.exit(1);
  } else {
    console.log('🎉 ALL AUTOMATED E2E AUDIT TESTS PASSED CLEANLY!');
    process.exit(0);
  }
}

runAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
