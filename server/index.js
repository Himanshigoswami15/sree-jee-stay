import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import { getTenantPasswordHash, updateTenantPasswordHash } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for Vercel frontend and mobile clients
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Initialize Supabase if credentials are provided in environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

const DEFAULT_PIN_HASH = bcrypt.hashSync('1234', 10);

/**
 * Health check endpoint for Railway deployment monitoring
 */
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'ReviewPulse Railway Backend API', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

/**
 * Helper to get tenant password hash from Supabase or local SQLite DB
 */
async function getPasswordHash(tenantId = 'demo') {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('tenant_passwords')
        .select('password_hash')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (!error && data && data.password_hash) {
        return data.password_hash;
      }

      if (!data) {
        await supabase
          .from('tenant_passwords')
          .insert({ tenant_id: tenantId, password_hash: DEFAULT_PIN_HASH, updated_at: new Date().toISOString() });
        return DEFAULT_PIN_HASH;
      }
    } catch (err) {
      console.error('[Railway Server] Supabase query error:', err.message);
    }
  }

  return getTenantPasswordHash(tenantId);
}

/**
 * Helper to update tenant password hash in Supabase or local SQLite DB
 */
async function setPasswordHash(tenantId = 'demo', newHash) {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('tenant_passwords')
        .upsert(
          { tenant_id: tenantId, password_hash: newHash, updated_at: new Date().toISOString() },
          { onConflict: 'tenant_id' }
        );

      if (error) {
        console.error('[Railway Server] Supabase update error:', error.message);
      }
    } catch (err) {
      console.error('[Railway Server] Supabase update exception:', err.message);
    }
  }

  updateTenantPasswordHash(tenantId, newHash);
  return true;
}

/**
 * POST /api/auth/verify - Verify Manager Password
 */
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { tenantId = 'demo', password = '' } = req.body || {};

    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required' });
    }

    const storedHash = await getPasswordHash(tenantId);
    const isMatch = bcrypt.compareSync(password, storedHash);

    if (isMatch) {
      return res.status(200).json({ success: true, message: 'Password verified successfully' });
    } else {
      return res.status(401).json({ success: false, error: 'Incorrect Security PIN / Password. Please try again.' });
    }
  } catch (err) {
    console.error('[POST /api/auth/verify Error]:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/change-password - Update Manager Password
 */
app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { tenantId = 'demo', oldPassword = '', newPassword = '', isOtpReset = false } = req.body || {};

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({
        success: false,
        error: 'New Password / PIN must be at least 4 characters long.'
      });
    }

    const storedHash = await getPasswordHash(tenantId);

    if (!isOtpReset) {
      if (!oldPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password is required to set a new password.'
        });
      }

      const isOldValid = bcrypt.compareSync(oldPassword, storedHash);
      if (!isOldValid) {
        return res.status(401).json({
          success: false,
          error: 'Incorrect current password. Password update failed.'
        });
      }
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    await setPasswordHash(tenantId, newHash);

    return res.status(200).json({
      success: true,
      message: 'Password updated and saved to database successfully.'
    });
  } catch (err) {
    console.error('[POST /api/auth/change-password Error]:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/status - Check tenant auth status
 */
app.get('/api/auth/status', async (req, res) => {
  const tenantId = req.query.tenantId || 'demo';
  const storedHash = await getPasswordHash(tenantId);
  return res.status(200).json({ success: true, tenantId, hasPassword: Boolean(storedHash) });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Railway Backend Server listening on port ${PORT}`);
});
