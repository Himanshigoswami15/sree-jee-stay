import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Building2, Plus, RefreshCw, CheckCircle2, AlertCircle, FileText, Trash2, ExternalLink } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useFeedback } from '../../context/FeedbackContext';
import { HotelRegistryModal } from './HotelRegistryModal';
import { JJLogo } from '../Common/JJLogo';

export function SuperAdminPortal() {
  const { registeredHotels, refreshHotels, deleteHotel } = useFeedback();

  const [secretKey, setSecretKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const openDeleteModal = (hotel) => {
    setDeleteTarget(hotel);
    setDeleteConfirmText('');
    setDeleteError('');
    setDeleteSuccess('');
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setDeleteConfirmText('');
    setDeleteError('');
    setDeleteSuccess('');
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const slug = deleteTarget.hotelSlug || deleteTarget.hotelId;
    if (deleteConfirmText !== slug) {
      setDeleteError(`Please type "${slug}" exactly to confirm deletion.`);
      return;
    }

    setIsDeleting(true);
    setDeleteError('');
    try {
      const result = await deleteHotel(slug);
      if (result && result.success) {
        setDeleteSuccess(result.message || `Property "${deleteTarget.name}" deleted successfully.`);
        refreshHotels();
        fetchAuditLogs();
        setTimeout(() => closeDeleteModal(), 1800);
      } else {
        setDeleteError(result?.error || 'Failed to delete property. Please try again.');
      }
    } catch (err) {
      setDeleteError(err?.message || 'An unexpected error occurred while deleting.');
    } finally {
      setIsDeleting(false);
    }
  };

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
      <div style={{ maxWidth: '440px', margin: '4.5rem auto', padding: '2.25rem 1.75rem', textAlign: 'center' }} className="saas-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <JJLogo size={52} rounded={14} showGlow={true} />
        </div>

        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>
          Super Admin Console
        </h1>

        <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Restricted platform administration. Authenticate with your secret key to manage multi-tenant businesses.
        </p>

        {authError && (
          <div className="saas-badge saas-badge-danger" style={{ width: '100%', padding: '0.5rem', marginBottom: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <AlertCircle size={14} /> <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSuperLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div className="saas-form-group">
            <label className="saas-label">
              <Lock size={13} /> Admin Secret Key:
            </label>
            <input
              type="password"
              className="saas-input"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter Admin Secret Key"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="saas-btn saas-btn-primary"
            style={{ width: '100%', height: '44px', justifyContent: 'center' }}
          >
            {isLoggingIn ? 'Verifying...' : 'Authenticate Super Admin'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '2rem auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Super Admin Top Header */}
      <div className="saas-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <JJLogo size={42} rounded={12} showGlow={true} />
            <div>
              <div className="saas-badge saas-badge-success" style={{ marginBottom: '0.2rem', padding: '0.15rem 0.5rem' }}>
                <ShieldCheck size={12} /> Super Admin Session
              </div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Enterprise Directory & Security Control
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="saas-btn saas-btn-primary"
              onClick={() => setIsRegistryOpen(true)}
              style={{ fontSize: '0.8125rem' }}
            >
              <Plus size={14} />
              <span>Onboard Property</span>
            </button>

            <button
              type="button"
              onClick={handleLogoutSuper}
              className="saas-btn saas-btn-secondary"
              style={{ fontSize: '0.8125rem' }}
            >
              Exit Console
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">
            <span>Registered Properties</span>
            <Building2 size={15} color="var(--brand-rose)" />
          </div>
          <div className="kpi-value">{registeredHotels.length}</div>
          <div className="kpi-subtext">Active multi-tenant instances</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">
            <span>Security Status</span>
            <ShieldCheck size={15} color="var(--emerald-600)" />
          </div>
          <div className="kpi-value" style={{ fontSize: '1.25rem', color: 'var(--emerald-600)', marginTop: '0.25rem' }}>
            Active & Verified
          </div>
          <div className="kpi-subtext">Full administrative privileges</div>
        </div>
      </div>

      {/* Property Directory */}
      <div className="saas-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
            Active Property Directory ({registeredHotels.length})
          </h2>
          <button
            type="button"
            onClick={refreshHotels}
            className="saas-btn saas-btn-secondary"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
          >
            <RefreshCw size={13} />
            <span>Refresh List</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.875rem' }}>
          {registeredHotels.map((h) => (
            <div
              key={h.hotelSlug || h.hotelId}
              style={{
                background: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-900)' }}>{h.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontFamily: 'monospace' }}>/{h.hotelSlug || h.hotelId}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                <a
                  href={`/${h.hotelSlug || h.hotelId}`}
                  className="saas-btn saas-btn-secondary"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', textDecoration: 'none' }}
                >
                  <ExternalLink size={12} />
                  <span>Portal</span>
                </a>

                <button
                  type="button"
                  onClick={() => openDeleteModal(h)}
                  className="saas-btn saas-btn-danger"
                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                  title={`Delete ${h.name}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Audit Trail */}
      <div className="saas-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={16} color="var(--brand-rose)" />
            <span>Audit & Event Logs</span>
          </h2>
          <button
            type="button"
            onClick={fetchAuditLogs}
            className="saas-btn saas-btn-secondary"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
          >
            <RefreshCw size={13} />
            <span>{isLoadingLogs ? 'Loading...' : 'Refresh Logs'}</span>
          </button>
        </div>

        {auditLogs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.8125rem' }}>
            No security events logged yet.
          </div>
        ) : (
          <div className="saas-table-wrapper" style={{ border: 'none' }}>
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Property</th>
                  <th>IP / Source</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log._id || log.id || Math.random()}>
                    <td style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                    </td>
                    <td>
                      <span className="saas-badge saas-badge-neutral">{log.action || 'Event'}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{log.hotelSlug || 'system'}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{log.ip || log.userAgent || 'Internal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="saas-modal-overlay" onClick={closeDeleteModal}>
          <div className="saas-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFF1F2', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #FECDD3' }}>
              <Trash2 size={24} />
            </div>

            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', margin: '0 0 0.35rem', textAlign: 'center' }}>
              Delete "{deleteTarget.name}"
            </h2>

            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', textAlign: 'center', lineHeight: '1.55', margin: '0 0 1rem' }}>
              Permanently remove this property and all associated feedback, QR codes, and analytics.
            </p>

            {deleteError && (
              <div className="saas-badge saas-badge-danger" style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <AlertCircle size={14} /> {deleteError}
              </div>
            )}

            {deleteSuccess && (
              <div className="saas-badge saas-badge-success" style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <CheckCircle2 size={14} /> {deleteSuccess}
              </div>
            )}

            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
              Type <code style={{ background: 'var(--slate-100)', padding: '0.1rem 0.35rem', borderRadius: '4px', color: 'var(--brand-rose)' }}>{deleteTarget.hotelSlug || deleteTarget.hotelId}</code> to confirm:
            </label>
            <input
              type="text"
              className="saas-input"
              value={deleteConfirmText}
              onChange={(e) => { setDeleteConfirmText(e.target.value); setDeleteError(''); }}
              placeholder={deleteTarget.hotelSlug || deleteTarget.hotelId}
              autoFocus
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="saas-btn saas-btn-secondary"
                onClick={closeDeleteModal}
                style={{ flex: 1 }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="saas-btn saas-btn-danger-solid"
                disabled={isDeleting || deleteConfirmText !== (deleteTarget.hotelSlug || deleteTarget.hotelId)}
                onClick={handleConfirmDelete}
                style={{ flex: 1 }}
              >
                <Trash2 size={14} />
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
