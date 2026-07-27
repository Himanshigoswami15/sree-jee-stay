import bcrypt from 'bcryptjs';

const DEFAULT_PIN_HASH = bcrypt.hashSync('1234', 10);

function getLocalPasswordHash(tenantId) {
  try {
    const saved = localStorage.getItem(`reviewpulse_password_hash_${tenantId}`);
    if (saved) return saved;
  } catch (e) {}
  return DEFAULT_PIN_HASH;
}

function setLocalPasswordHash(tenantId, hash) {
  try {
    localStorage.setItem(`reviewpulse_password_hash_${tenantId}`, hash);
  } catch (e) {}
}

export async function verifyPasswordApi(tenantId = 'demo', password) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, password }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (res.ok && data.success) {
        // Sync local hash for offline fallback
        const newHash = bcrypt.hashSync(password, 10);
        setLocalPasswordHash(tenantId, newHash);
        return data;
      } else if (res.status === 401 || (data && !data.success)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[authService] Server API unavailable, using client bcrypt verification:', err.message);
  }

  // Fallback: Verify using client-side bcryptjs
  try {
    const hash = getLocalPasswordHash(tenantId);
    const isMatch = bcrypt.compareSync(password, hash);
    if (isMatch) {
      return { success: true, message: 'Password verified successfully' };
    }
    return { success: false, error: 'Incorrect Security PIN / Password. Please try again.' };
  } catch (e) {
    return { success: false, error: 'Incorrect Security PIN / Password. Please try again.' };
  }
}

export async function changePasswordApi(tenantId = 'demo', oldPassword, newPassword, isOtpReset = false) {
  if (!newPassword || newPassword.length < 4) {
    return { success: false, error: 'New Password / PIN must be at least 4 characters long.' };
  }

  let apiResult = null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, oldPassword, newPassword, isOtpReset }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      apiResult = await res.json();
      if (res.ok && apiResult.success) {
        const newHash = bcrypt.hashSync(newPassword, 10);
        setLocalPasswordHash(tenantId, newHash);
        return apiResult;
      } else if (res.status === 401 || (apiResult && !apiResult.success)) {
        return apiResult;
      }
    }
  } catch (err) {
    console.warn('[authService] Server API unavailable, updating client bcrypt store:', err.message);
  }

  // Fallback: Update using client-side bcryptjs
  try {
    const hash = getLocalPasswordHash(tenantId);
    if (!isOtpReset) {
      if (!oldPassword) {
        return { success: false, error: 'Current password is required to set a new password.' };
      }
      const isOldValid = bcrypt.compareSync(oldPassword, hash);
      if (!isOldValid) {
        return { success: false, error: 'Incorrect current password. Password update failed.' };
      }
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    setLocalPasswordHash(tenantId, newHash);
    return { success: true, message: 'Password updated and saved successfully.' };
  } catch (e) {
    return { success: false, error: 'Failed to update password.' };
  }
}
