import React, { useState, useEffect } from 'react';
import { Building2, QrCode, Save, CheckCircle2, Tag, Sparkles, Settings, Trash2, AlertCircle } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { QrStudio } from './QrStudio';
import { SettingsModal } from '../Common/SettingsModal';
import { validateGoogleReviewLink } from '../../utils/googleReview';
import { apiClient } from '../../services/apiClient';

export function TabbedDashboard() {
  const { settings, updateSettings, feedbacks, deleteHotel } = useFeedback();
  const [activeSection, setActiveSection] = useState('qr'); // 'qr' | 'business'
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [businessForm, setBusinessForm] = useState({
    hotelName: settings?.hotelName || '',
    googlePlaceId: settings?.googlePlaceId || '',
    googleReviewUrl: settings?.googleReviewUrl || '',
    logoUrl: settings?.logoUrl || '',
    themeColor: settings?.themeColor || '#2563eb',
    tone: settings?.tone || 'friendly',
  });

  const [businessSaved, setBusinessSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [linkValidation, setLinkValidation] = useState(null);
  const [_analytics, setAnalytics] = useState(null);

  // Delete hotel state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const hotelSlug = settings?.hotelSlug || '';

  useEffect(() => {
    setBusinessForm({
      hotelName: settings?.hotelName || '',
      googlePlaceId: settings?.googlePlaceId || '',
      googleReviewUrl: settings?.googleReviewUrl || '',
      logoUrl: settings?.logoUrl || '',
      themeColor: settings?.themeColor || '#2563eb',
      tone: settings?.tone || 'friendly',
    });

    if (settings?.googlePlaceId || settings?.googleReviewUrl) {
      setLinkValidation(validateGoogleReviewLink(settings.googleReviewUrl || settings.googlePlaceId));
    }
  }, [settings]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await apiClient(`/api/review/analytics?hotelSlug=${encodeURIComponent(hotelSlug)}`);
        if (res.success && res.analytics) {
          setAnalytics(res.analytics);
        }
      } catch (e) {}
    }
    fetchAnalytics();
  }, [hotelSlug]);

  const handleSaveBusiness = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(businessForm);
    setIsSaving(false);
    setBusinessSaved(true);
    setTimeout(() => setBusinessSaved(false), 2500);
  };

  const handlePlaceIdChange = (val) => {
    setBusinessForm((prev) => ({ ...prev, googlePlaceId: val }));
    if (val.trim()) {
      setLinkValidation(validateGoogleReviewLink(val));
    } else {
      setLinkValidation(null);
    }
  };

  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];
  const alertCount = safeFeedbacks.filter((f) => f && f.rating <= (settings?.alertThreshold || 3) && !f.managerResolved).length;
  const avgRating = safeFeedbacks.length > 0
    ? (safeFeedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / safeFeedbacks.length).toFixed(1)
    : '5.0';

  return (
    <div className="dashboard-container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '1rem' }}>
      {/* HEADER TITLE & NAVIGATION TABS */}
      <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
        <div className="dashboard-title-group">
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
            Enterprise Guest Review & QR Platform
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {settings?.hotelName || 'Business'} Review Dashboard
          </h1>
        </div>

        {/* CLEAN 3-TAB NAVIGATION */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '6px', borderRadius: '14px', border: '1px solid #cbd5e1', overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginTop: '1rem' }}>
          <button
            type="button"
            className={`nav-tab-btn ${activeSection === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveSection('qr')}
            style={{ fontSize: '0.85rem', padding: '0.55rem 1rem', fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            <QrCode size={16} color={activeSection === 'qr' ? '#ffffff' : '#374151'} /> 1. Paste Review Link & Unique QR Studio
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeSection === 'business' ? 'active' : ''}`}
            onClick={() => setActiveSection('business')}
            style={{ fontSize: '0.85rem', padding: '0.55rem 1rem', fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            <Building2 size={16} color={activeSection === 'business' ? '#ffffff' : '#374151'} /> 2. Hotel & Company Settings
          </button>
        </div>
      </div>

      {/* SECTION 1: QR & REVIEW LINK STUDIO */}
      {activeSection === 'qr' && (
        <QrStudio />
      )}

      {/* SECTION 2: HOTEL & COMPANY SETTINGS */}
      {activeSection === 'business' && (
        <div className="chart-card" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <div className="chart-title" style={{ marginBottom: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 800, fontSize: '1.1rem' }}>
              <Building2 size={22} color="#2563eb" /> Hotel & Company Configuration
            </span>
          </div>

          {businessSaved && (
            <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#059669" /> Business Settings Saved Successfully!
            </div>
          )}

          <form onSubmit={handleSaveBusiness} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 800, color: '#0f172a' }}>Hotel / Company Name:</label>
              <input
                type="text"
                className="form-input"
                value={businessForm.hotelName}
                onChange={(e) => setBusinessForm({ ...businessForm, hotelName: e.target.value })}
                placeholder="e.g. Grand Hotel / Artisan Cafe"
                required
              />
            </div>

            <div className="form-group" style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <label className="form-label" style={{ fontWeight: 800, color: '#1e293b' }}>
                Google Place ID or Maps URL (Starts with <code>ChIJ...</code>):
              </label>
              <input
                type="text"
                className="form-input"
                value={businessForm.googlePlaceId}
                onChange={(e) => handlePlaceIdChange(e.target.value)}
                placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
              />

              {linkValidation && linkValidation.message && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.775rem', fontWeight: 700, color: linkValidation.isValid ? '#15803d' : '#b45309' }}>
                  {linkValidation.message}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 800, color: '#0f172a' }}>Direct Review URL:</label>
              <input
                type="url"
                className="form-input"
                value={businessForm.googleReviewUrl}
                onChange={(e) => setBusinessForm({ ...businessForm, googleReviewUrl: e.target.value })}
                placeholder="https://g.page/r/... or https://search.google.com/local/writereview?placeid=..."
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 800 }}>Logo Image URL (Optional):</label>
                <input
                  type="url"
                  className="form-input"
                  value={businessForm.logoUrl}
                  onChange={(e) => setBusinessForm({ ...businessForm, logoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 800 }}>Review Writing Tone:</label>
                <select
                  className="form-input"
                  value={businessForm.tone}
                  onChange={(e) => setBusinessForm({ ...businessForm, tone: e.target.value })}
                  style={{ fontWeight: 700 }}
                >
                  <option value="friendly">😊 Friendly & Warm</option>
                  <option value="professional">💼 Professional & Formal</option>
                  <option value="luxury">👑 Luxury & Elegant</option>
                  <option value="family">👨‍👩‍👧‍👦 Family Friendly</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary-action" disabled={isSaving} style={{ width: 'auto', padding: '0.65rem 1.5rem' }}>
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Business Settings'}
              </button>
            </div>
          </form>

          {/* KEYWORD TAGS & INDUSTRY PRESETS CARD */}
          <div style={{ marginTop: '1.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                <Tag size={18} color="#2563eb" />
                <span>Review Keywords & Industry Presets</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>
                Add custom tags (e.g. ROI Results, Fast Check-in, High ROAS), edit snippets, or apply presets for Marketing Agencies, Hotels, Restaurants & Clinics.
              </div>
            </div>

            <button
              type="button"
              className="btn-primary-action"
              onClick={() => setIsSettingsModalOpen(true)}
              style={{ width: 'auto', padding: '0.6rem 1.25rem', background: '#2563eb', color: '#ffffff', fontSize: '0.85rem', fontWeight: 800 }}
            >
              <Sparkles size={15} /> Manage Keywords & Presets
            </button>
          </div>

          {/* DANGER ZONE — DELETE THIS HOTEL */}
          <div style={{ marginTop: '2rem', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, color: '#B91C1C', fontSize: '1rem' }}>
                  <Trash2 size={18} color="#DC2626" />
                  <span>Danger Zone — Delete This Hotel</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#991B1B', marginTop: '0.25rem' }}>
                  Permanently delete <strong>{settings?.hotelName || 'this hotel'}</strong> and all its data including reviews, QR codes, keywords, analytics, and user accounts. This action cannot be undone.
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setShowDeleteConfirm(true); setDeleteConfirmText(''); setDeleteError(''); }}
                style={{ width: 'auto', padding: '0.6rem 1.25rem', background: '#DC2626', color: '#ffffff', fontSize: '0.85rem', fontWeight: 800, border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'background 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#B91C1C'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#DC2626'; }}
              >
                <Trash2 size={15} /> Delete This Hotel
              </button>
            </div>
          </div>

          {/* DELETE CONFIRMATION MODAL */}
          {showDeleteConfirm && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div style={{ background: '#ffffff', borderRadius: '18px', maxWidth: '480px', width: '100%', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid #E5E7EB', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.25rem', color: '#6B7280', cursor: 'pointer', lineHeight: 1 }}
                >
                  ✕
                </button>

                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #FCA5A5' }}>
                  <Trash2 size={28} />
                </div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 0.35rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
                  Delete "{settings?.hotelName || 'Hotel'}" Permanently
                </h2>

                <p style={{ fontSize: '0.85rem', color: '#6B7280', textAlign: 'center', lineHeight: 1.6, margin: '0 0 1rem' }}>
                  This will permanently remove <strong style={{ color: '#111827' }}>{settings?.hotelName || 'this hotel'}</strong> and all associated data including feedbacks, users, settings, QR codes, keywords, analytics, and audit logs.
                </p>

                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#92400E', fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <AlertCircle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span>This action is <strong>irreversible</strong>. You will be logged out and redirected to the home page after deletion.</span>
                </div>

                {deleteError && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.75rem', borderRadius: '10px', fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
                    <AlertCircle size={16} color="#EF4444" />
                    <span>{deleteError}</span>
                  </div>
                )}

                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                  Type <code style={{ background: '#F3F4F6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#DC2626' }}>{hotelSlug}</code> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => { setDeleteConfirmText(e.target.value); setDeleteError(''); }}
                  placeholder={hotelSlug}
                  autoFocus
                  style={{ width: '100%', height: '44px', fontSize: '0.875rem', borderRadius: '12px', border: `1px solid ${deleteConfirmText === hotelSlug ? '#22C55E' : '#E5E7EB'}`, background: '#FAFAFB', padding: '0 0.85rem', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.15s ease' }}
                />

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{ flex: 1, height: '44px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 600, background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#374151', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (deleteConfirmText !== hotelSlug) {
                        setDeleteError(`Please type "${hotelSlug}" exactly to confirm.`);
                        return;
                      }
                      setIsDeleting(true);
                      setDeleteError('');
                      try {
                        const result = await deleteHotel(hotelSlug);
                        if (result && result.success) {
                          localStorage.removeItem('jj_access_token');
                          localStorage.removeItem('jj_super_admin_key');
                          window.location.href = '/';
                        } else {
                          setDeleteError(result?.error || 'Failed to delete. Please try again.');
                        }
                      } catch (err) {
                        setDeleteError(err?.message || 'An unexpected error occurred.');
                      } finally {
                        setIsDeleting(false);
                      }
                    }}
                    disabled={isDeleting || deleteConfirmText !== hotelSlug}
                    style={{ flex: 1, height: '44px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 600, background: deleteConfirmText === hotelSlug ? '#DC2626' : '#E5E7EB', color: deleteConfirmText === hotelSlug ? '#ffffff' : '#9CA3AF', border: 'none', cursor: deleteConfirmText === hotelSlug ? 'pointer' : 'not-allowed', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <Trash2 size={15} />
                    {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}

