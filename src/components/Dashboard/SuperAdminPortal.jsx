import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Building2, Plus, RefreshCw, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useFeedback } from '../../context/FeedbackContext';
import { HotelRegistryModal } from './HotelRegistryModal';

export function SuperAdminPortal() {
  const { registeredHotels, refreshHotels } = useFeedback();

  const [secretKey, setSecretKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Auto-check stored session or attempt Super Admin login
  useEffect(() => {
    const savedToken = localStorage.getItem('jj_super_admin_key');
    if (savedToken) {
      setSecretKey(savedToken);
      setIsAuthenticated(true);
      fetchAuditLogs();
    }
  }, []);

  const handleSuperLogin = async (e) => {
    if (e) e.preventDefault();
    if (!secretKey.trim()) {
      setAuthError('Please enter the Admin Secret Key.');
      return;
    }

    setIsLoggingIn(true);
    setAuthError('');

    try {
      const res = await apiClient('/api/auth/super-login', {
        method: 'POST',
        body: JSON.stringify({ secretKey: secretKey.trim() }),
      });

      if (res && res.success) {
        setIsAuthenticated(true);
        localStorage.setItem('jj_super_admin_key', secretKey.trim());
        if (res.accessToken) {
          localStorage.setItem('jj_access_token', res.accessToken);
        }
        fetchAuditLogs();
      } else {
        setAuthError(res?.error || 'Invalid Admin Secret Key.');
      }
    } catch (err) {
      setAuthError(err?.message || 'Error authenticating Super Admin credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await apiClient('/api/audit?limit=25');
      if (res && res.success && Array.isArray(res.logs)) {
        setAuditLogs(res.logs);
      }
    } catch (e) {
      console.warn('[SuperAdminPortal] Error fetching audit logs:', e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleLogoutSuper = () => {
    setIsAuthenticated(false);
    setSecretKey('');
    localStorage.removeItem('jj_super_admin_key');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '2rem', background: '#ffffff', borderRadius: '18px', border: '1px solid #E5E7EB', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #BFDBFE' }}>
          <ShieldCheck size={36} />
        </div>

        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#111827', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
          JJ Review Super Admin Portal
        </h1>

        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Restricted platform administration area. Enter your environment secret key to access global multi-business onboarding & security logs.
        </p>

        {authError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.75rem', borderRadius: '10px', fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem', textAlign: 'left' }}>
            <AlertCircle size={16} color="#EF4444" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSuperLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, color: '#374151', fontSize: '0.8125rem' }}>
              🔑 Admin Secret Key (`ADMIN_SECRET_KEY`):
            </label>
            <input
              type="password"
              className="form-input"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="e.g. JJR-2026-SUPER-6X8F91ZP-K29A"
              required
              autoFocus
              style={{ height: '44px', fontSize: '0.875rem', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#FAFAFB', padding: '0 0.85rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="btn-primary-action"
            style={{ height: '48px', borderRadius: '14px', fontSize: '0.9375rem', fontWeight: 600, background: '#2563EB', color: '#ffffff', width: '100%', justifyContent: 'center' }}
          >
            {isLoggingIn ? 'Verifying Admin Key...' : 'Authenticate Super Admin'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '2rem auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* SUPER ADMIN HEADER */}
      <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#15803D', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <ShieldCheck size={13} /> Active SUPER_ADMIN Session
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
            Super Admin Control Center
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => setIsRegistryOpen(true)}
            style={{ height: '42px', padding: '0 1.25rem', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 600, background: '#2563EB', color: '#ffffff' }}
          >
            <Plus size={16} /> + Onboard New Hotel
          </button>

          <button
            type="button"
            onClick={handleLogoutSuper}
            style={{ height: '42px', padding: '0 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', cursor: 'pointer' }}
          >
            Exit Super Admin
          </button>
        </div>
      </div>

      {/* METRICS & OVERVIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#6B7280', fontSize: '0.8125rem', fontWeight: 600 }}>Active Businesses / Hotels</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginTop: '0.25rem' }}>
            {registeredHotels.length}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#6B7280', fontSize: '0.8125rem', fontWeight: 600 }}>Security Key Status</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#15803D', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={18} color="#22C55E" /> Validated (`ADMIN_SECRET_KEY`)
          </div>
        </div>
      </div>

      {/* REGISTERED HOTELS LIST */}
      <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} color="#2563EB" /> Registered Hotel Directory ({registeredHotels.length})
          </h2>
          <button
            type="button"
            onClick={refreshHotels}
            style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#374151', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RefreshCw size={13} /> Refresh List
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem' }}>
          {registeredHotels.map((h) => (
            <div key={h.hotelSlug || h.hotelId} style={{ background: '#FAFAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{h.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280', fontFamily: 'monospace' }}>/{h.hotelSlug || h.hotelId}</div>
              </div>
              <a
                href={`/${h.hotelSlug || h.hotelId}`}
                style={{ fontSize: '0.775rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none', background: '#EFF6FF', padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid #BFDBFE' }}
              >
                View Profile ↗
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* SYSTEM SECURITY AUDIT LOGS */}
      <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#2563EB" /> Security & Onboarding Audit Trail
          </h2>
          <button
            type="button"
            onClick={fetchAuditLogs}
            style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#374151', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RefreshCw size={13} /> {isLoadingLogs ? 'Loading...' : 'Refresh Audit Logs'}
          </button>
        </div>

        {auditLogs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280', fontSize: '0.85rem', background: '#FAFAFB', borderRadius: '12px', border: '1px dashed #E5E7EB' }}>
            No security events logged yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Event Type</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Hotel / Scope</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Details</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log._id || log.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: log.eventType?.includes('FAILED') ? '#DC2626' : '#15803D' }}>
                      {log.eventType}
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'monospace', color: '#374151' }}>
                      {log.hotelId || log.hotelSlug || 'SYSTEM'}
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#4B5563', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {JSON.stringify(log.details || {})}
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#6B7280' }}>
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <HotelRegistryModal
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
        onHotelOnboarded={(slug) => {
          refreshHotels();
          fetchAuditLogs();
        }}
      />
    </div>
  );
}
