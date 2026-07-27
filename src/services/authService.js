export async function verifyPasswordApi(tenantId, password) {
  try {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, password }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error verifying password via API:', err);
    return { success: false, error: 'Network error or server unavailable.' };
  }
}

export async function changePasswordApi(tenantId, oldPassword, newPassword, isOtpReset = false) {
  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, oldPassword, newPassword, isOtpReset }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error changing password via API:', err);
    return { success: false, error: 'Network error or server unavailable.' };
  }
}
