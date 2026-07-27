import bcrypt from 'bcryptjs';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const API_BASE_URL = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '');

function getApiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanEndpoint}` : cleanEndpoint;
}

const DEFAULT_PIN_HASH = bcrypt.hashSync('1234', 10);

function getLocalFallbackHash(tenantId) {
  try {
    const saved = localStorage.getItem(`reviewpulse_password_hash_${tenantId}`);
    if (saved) return saved;
  } catch (e) {}
  return DEFAULT_PIN_HASH;
}

function setLocalFallbackHash(tenantId, hash) {
  try {
    localStorage.setItem(`reviewpulse_password_hash_${tenantId}`, hash);
  } catch (e) {}
}

/**
 * Fetch tenant password hash from Supabase cloud database, server API, or local fallback.
 */
async function fetchPasswordHash(tenantId = 'demo') {
  // 1. Try Supabase Cloud Database if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tenant_passwords')
        .select('password_hash')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (!error && data && data.password_hash) {
        return data.password_hash;
      }

      // Seed default hash in Supabase if no row exists yet
      if (!data) {
        await supabase
          .from('tenant_passwords')
          .insert({ tenant_id: tenantId, password_hash: DEFAULT_PIN_HASH, updated_at: new Date().toISOString() });
        return DEFAULT_PIN_HASH;
      }
    } catch (err) {
      console.warn('[authService] Supabase query failed:', err.message);
    }
  }

  // 2. Try Backend server API (Railway / Node) if available
  try {
    const res = await fetch(getApiUrl(`/api/auth/status?tenantId=${encodeURIComponent(tenantId)}`));
    if (res.ok) {
      const statusData = await res.json();
      if (statusData && statusData.hasPassword) {
        return 'USE_SERVER_API';
      }
    }
  } catch (e) {}

  // 3. Local fallback
  return getLocalFallbackHash(tenantId);
}

/**
 * Save new tenant password hash to Supabase cloud database, server API, and local fallback.
 */
async function persistPasswordHash(tenantId = 'demo', newHash) {
  let isSavedToCloud = false;

  // 1. Update Supabase Cloud Database if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('tenant_passwords')
        .upsert(
          { tenant_id: tenantId, password_hash: newHash, updated_at: new Date().toISOString() },
          { onConflict: 'tenant_id' }
        );

      if (!error) {
        isSavedToCloud = true;
      } else {
        console.error('[authService] Supabase upsert error:', error.message);
      }
    } catch (err) {
      console.error('[authService] Supabase update exception:', err.message);
    }
  }

  // Always update local fallback storage
  setLocalFallbackHash(tenantId, newHash);
  return isSavedToCloud;
}

/**
 * LOGIN / AUTHENTICATION FUNCTION
 */
export async function verifyPasswordApi(tenantId = 'demo', password) {
  if (!password) {
    return { success: false, error: 'Password is required' };
  }

  // 1. Try Backend server API (Railway / Node)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(getApiUrl('/api/auth/verify'), {
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
        const newHash = bcrypt.hashSync(password, 10);
        setLocalFallbackHash(tenantId, newHash);
        return data;
      } else if (res.status === 401 || (data && !data.success)) {
        return data;
      }
    }
  } catch (err) {
    // Backend API unreachable, proceed to Supabase / local verification
  }

  // 2. Direct Cloud Database (Supabase) or Local Verification
  try {
    const hash = await fetchPasswordHash(tenantId);
    if (hash !== 'USE_SERVER_API') {
      const isMatch = bcrypt.compareSync(password, hash);
      if (isMatch) {
        return { success: true, message: 'Password verified successfully' };
      }
      return { success: false, error: 'Incorrect Security PIN / Password. Please try again.' };
    }
  } catch (e) {
    console.error('[authService] Verification error:', e);
  }

  return { success: false, error: 'Incorrect Security PIN / Password. Please try again.' };
}

/**
 * PASSWORD CHANGE / UPDATE FUNCTION
 */
export async function changePasswordApi(tenantId = 'demo', oldPassword, newPassword, isOtpReset = false) {
  if (!newPassword || newPassword.length < 4) {
    return { success: false, error: 'New Password / PIN must be at least 4 characters long.' };
  }

  // First verify old password unless resetting via verified OTP
  if (!isOtpReset) {
    if (!oldPassword) {
      return { success: false, error: 'Current password is required to set a new password.' };
    }
    const verifyRes = await verifyPasswordApi(tenantId, oldPassword);
    if (!verifyRes.success) {
      return { success: false, error: 'Incorrect current password. Password update failed.' };
    }
  }

  const newHash = bcrypt.hashSync(newPassword, 10);

  // 1. Try Backend server API (Railway / Node)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(getApiUrl('/api/auth/change-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, oldPassword, newPassword, isOtpReset }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (res.ok && data.success) {
        await persistPasswordHash(tenantId, newHash);
        return data;
      }
    }
  } catch (err) {
    // API not reachable, proceed to direct Supabase cloud DB persistence
  }

  // 2. Direct Cloud Database (Supabase) Persistence
  const savedToCloud = await persistPasswordHash(tenantId, newHash);

  return {
    success: true,
    message: savedToCloud
      ? 'Password updated and saved to Supabase cloud database permanently.'
      : 'Password updated and saved successfully.'
  };
}
