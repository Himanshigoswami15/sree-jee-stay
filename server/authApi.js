import bcrypt from 'bcryptjs';
import { getTenantPasswordHash, updateTenantPasswordHash } from './db.js';

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export async function authApiMiddleware(req, res, next) {
  const urlPath = req.url.split('?')[0];

  if (req.method === 'POST' && (urlPath === '/verify' || urlPath === '/verify/')) {
    try {
      const body = await getRawBody(req);
      const tenantId = body.tenantId || 'demo';
      const password = body.password || '';

      if (!password) {
        return sendJson(res, 400, { success: false, error: 'Password is required' });
      }

      const storedHash = getTenantPasswordHash(tenantId);
      const isMatch = bcrypt.compareSync(password, storedHash);

      if (isMatch) {
        return sendJson(res, 200, { success: true, message: 'Password verified successfully' });
      } else {
        return sendJson(res, 401, { success: false, error: 'Incorrect Security PIN / Password. Please try again.' });
      }
    } catch (err) {
      console.error('[API /verify Error]:', err);
      return sendJson(res, 500, { success: false, error: 'Internal server error' });
    }
  }

  if (req.method === 'POST' && (urlPath === '/change-password' || urlPath === '/change-password/')) {
    try {
      const body = await getRawBody(req);
      const tenantId = body.tenantId || 'demo';
      const oldPassword = body.oldPassword || '';
      const newPassword = body.newPassword || '';
      const isOtpReset = Boolean(body.isOtpReset);

      // Basic validation
      if (!newPassword || newPassword.length < 4) {
        return sendJson(res, 400, {
          success: false,
          error: 'New Password / PIN must be at least 4 characters long.'
        });
      }

      const storedHash = getTenantPasswordHash(tenantId);

      // Verify old password unless resetting via verified OTP
      if (!isOtpReset) {
        if (!oldPassword) {
          return sendJson(res, 400, {
            success: false,
            error: 'Current password is required to set a new password.'
          });
        }

        const isOldValid = bcrypt.compareSync(oldPassword, storedHash);
        if (!isOldValid) {
          return sendJson(res, 401, {
            success: false,
            error: 'Incorrect current password. Password update failed.'
          });
        }
      }

      // Hash new password using bcrypt
      const newHash = bcrypt.hashSync(newPassword, 10);
      updateTenantPasswordHash(tenantId, newHash);

      return sendJson(res, 200, {
        success: true,
        message: 'Password updated and saved to database successfully.'
      });
    } catch (err) {
      console.error('[API /change-password Error]:', err);
      return sendJson(res, 500, { success: false, error: 'Internal server error' });
    }
  }

  if (req.method === 'GET' && (urlPath === '/status' || urlPath === '/status/')) {
    const tenantId = new URLSearchParams(req.url.split('?')[1] || '').get('tenantId') || 'demo';
    const storedHash = getTenantPasswordHash(tenantId);
    return sendJson(res, 200, { success: true, tenantId, hasPassword: Boolean(storedHash) });
  }

  if (next) {
    next();
  } else {
    sendJson(res, 404, { success: false, error: 'Endpoint not found' });
  }
}
