let rawApiUrl = '/api';
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '/api';
}
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');
const CSRF_SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function getFullUrl(endpoint) {
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If cleanEndpoint is already a full http/https URL, return as-is
  if (cleanEndpoint.startsWith('http://') || cleanEndpoint.startsWith('https://')) {
    return cleanEndpoint;
  }

  // Ensure endpoint starts with /api or /r
  if (!cleanEndpoint.startsWith('/api/') && !cleanEndpoint.startsWith('/r/') && cleanEndpoint !== '/api') {
    cleanEndpoint = `/api${cleanEndpoint}`;
  }

  if (API_BASE_URL && API_BASE_URL.startsWith('http')) {
    const normalizedBase = API_BASE_URL.replace(/\/+$/, '').replace(/\/api$/, '');
    return `${normalizedBase}${cleanEndpoint}`;
  }

  return cleanEndpoint;
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

  const maxRetries = options.method && options.method !== 'GET' ? 2 : 3;
  let response = null;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutMs = options.timeoutMs || 15000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const config = {
      ...options,
      headers,
      credentials: 'include',
      signal: options.signal || controller.signal,
    };

    try {
      response = await fetch(fullUrl, config);
      clearTimeout(timeoutId);
      lastError = null;
      break;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
      if (attempt < maxRetries) {
        // Render free-tier cold start backoff wait
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }

  if (lastError || !response) {
    console.error(`[API Client Error] ${endpoint} (${fullUrl}):`, lastError);
    return {
      success: false,
      error: lastError?.name === 'AbortError'
        ? `Request timeout connecting to backend server`
        : `Connecting to server... Please try again in 5 seconds.`,
    };
  }

  try {
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
            headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
          }
        }
        options._isRetry = true;
        const csrfToken = getCsrfToken();
        if (csrfToken) {
          headers['X-CSRF-Token'] = csrfToken;
        }
        response = await fetch(fullUrl, { ...options, headers, credentials: 'include' });
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
        error: data.message || data.error || `HTTP ${response.status}: Request failed`,
        status: response.status,
      };
    }

    return data;
  } catch (err) {
    console.error(`[API Response Parsing Error] ${endpoint} (${fullUrl}):`, err);
    return {
      success: false,
      error: `Failed to process response from server`,
    };
  }
}
