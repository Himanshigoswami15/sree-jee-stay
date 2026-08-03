const API_BASE_URL = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '');
const CSRF_SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function getFullUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanEndpoint}` : cleanEndpoint;
}

function getCsrfToken() {
  try {
    const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch (e) {
    return null;
  }
}

export async function apiClient(endpoint, options = {}) {
  let fullUrl = getFullUrl(endpoint);

  const method = (options.method || 'GET').toUpperCase();
  if (method === 'GET') {
    const separator = fullUrl.includes('?') ? '&' : '?';
    fullUrl = `${fullUrl}${separator}_t=${Date.now()}`;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    ...(options.headers || {}),
  };

  const savedToken = typeof window !== 'undefined' ? localStorage.getItem('jj_access_token') : null;
  if (savedToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${savedToken}`;
  }

  if (!CSRF_SAFE_METHODS.has(options.method || 'GET')) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || 10000);

  const config = {
    ...options,
    headers,
    credentials: 'include',
    signal: options.signal || controller.signal,
  };

  try {
    let response = await fetch(fullUrl, config);
    clearTimeout(timeoutId);

    if (response.status === 401 && !options._isRetry) {
      const refreshRes = await fetch(getFullUrl('/api/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json().catch(() => ({}));
        if (refreshData?.accessToken && typeof window !== 'undefined') {
          localStorage.setItem('jj_access_token', refreshData.accessToken);
          config.headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
        }
        config._isRetry = true;
        const csrfToken = getCsrfToken();
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }
        response = await fetch(fullUrl, config);
      }
    }

    const contentType = response.headers.get('content-type') || '';
    let data = {};
    if (contentType.includes('application/json')) {
      data = await response.json();
    }

    if (data?.accessToken && typeof window !== 'undefined') {
      localStorage.setItem('jj_access_token', data.accessToken);
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: Request failed`,
        status: response.status,
      };
    }

    return data;
  } catch (err) {
    console.error(`[API Client Error] ${endpoint}:`, err);
    return {
      success: false,
      error: 'Network error or backend server unreachable.',
    };
  }
}
