const CSRF_SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function csrfProtection(req, res, next) {
  if (CSRF_SAFE_METHODS.has(req.method)) {
    return next();
  }

  const headerToken = req.headers['x-csrf-token'];
  const cookieToken = req.cookies?.['csrf-token'];

  if (!headerToken || !cookieToken) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token missing. Request rejected.',
    });
  }

  if (headerToken !== cookieToken) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token mismatch. Request rejected.',
    });
  }

  next();
}
