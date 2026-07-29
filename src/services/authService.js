import { apiClient } from './apiClient';

export async function verifyPasswordApi(identifier = 'sree-jee-stay', password) {
  if (!password) {
    return { success: false, error: 'Password is required' };
  }

  return await apiClient('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ hotelId: identifier, hotelSlug: identifier, password }),
  });
}

export async function changePasswordApi(identifier = 'sree-jee-stay', oldPassword, newPassword, isOtpReset = false) {
  if (!newPassword || newPassword.length < 4) {
    return { success: false, error: 'New Password / PIN must be at least 4 characters long.' };
  }

  return await apiClient('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ hotelId: identifier, hotelSlug: identifier, oldPassword, newPassword, isOtpReset }),
  });
}

export async function getAuthStatusApi(identifier = 'sree-jee-stay') {
  return await apiClient(`/api/auth/status?hotelId=${encodeURIComponent(identifier)}`);
}

export async function logoutApi() {
  return await apiClient('/api/auth/logout', { method: 'POST' });
}
