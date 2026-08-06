let rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '/api';
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');
const CSRF_SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function getFullUrl(endpoint) {
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) return cleanEndpoint;

  // Remove trailing slashes and trailing /api suffix from base URL
  const normalizedBase = API_BASE_URL.replace(/\/+$/, '').replace(/\/api$/, '');

  // Ensure cleanEndpoint has /api prefix unless it already starts with /api/ or /r/
  if (!cleanEndpoint.startsWith('/api/') && !cleanEndpoint.startsWith('/r/') && cleanEndpoint !== '/api') {
    cleanEndpoint = `/api${cleanEndpoint}`;
  }

  return `${normalizedBase}${cleanEndpoint}`;
}

function getCsrfToken() {
  try {
    const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch (e) {
    return null;
  }
}

function parseJwtPayload(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
}

function isTokenMatchingCurrentRoute(token) {
  if (!token || typeof window === 'undefined') return false;
  const payload = parseJwtPayload(token);
  if (!payload) return false;

  const currentSlug = window.location.pathname.split('/')[1]?.toLowerCase();
  if (!currentSlug || currentSlug === 'r' || currentSlug === 'api') return true;

  const tokenHotel = (payload.hotelSlug || payload.hotelId || '').toLowerCase();
  if (tokenHotel && tokenHotel !== currentSlug) {
    return false;
  }
  return true;
}

function setScopedAccessToken(token) {
  if (typeof window === 'undefined') return;
  if (!token) {
    localStorage.removeItem('jj_access_token');
    return;
  }
  if (isTokenMatchingCurrentRoute(token)) {
    localStorage.setItem('jj_access_token', token);
  } else {
    localStorage.removeItem('jj_access_token');
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
  if (savedToken && isTokenMatchingCurrentRoute(savedToken)) {
    if (!headers['Authorization']) {
      headers['Authorization'] = `Bearer ${savedToken}`;
    }
  } else if (savedToken) {
    localStorage.removeItem('jj_access_token');
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
          setScopedAccessToken(refreshData.accessToken);
          if (isTokenMatchingCurrentRoute(refreshData.accessToken)) {
            config.headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
          }
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
      setScopedAccessToken(data.accessToken);
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
    console.error(`[API Client Error] ${endpoint} (${fullUrl}):`, err);
    return {
      success: false,
      error: err.name === 'AbortError'
        ? `Request timeout connecting to ${fullUrl}`
        : `Network error (${fullUrl}): ${err.message || 'Server unreachable'}`,
    };
  }
}
