import React, { useState, useEffect } from 'react';
import {
  Building2,
  QrCode,
  Save,
  CheckCircle2,
  Tag,
  Sparkles,
  Settings,
  Trash2,
  AlertCircle,
  LayoutDashboard,
  MessageSquare,
  Star,
  Smartphone,
  TrendingUp,
  BarChart3,
  Globe,
  Sliders
} from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { QrStudio } from './QrStudio';
import { FeedbackTable } from './FeedbackTable';
import { SettingsModal } from '../Common/SettingsModal';
import { validateGoogleReviewLink } from '../../utils/googleReview';
import { apiClient } from '../../services/apiClient';

export function TabbedDashboard() {
  const { settings, updateSettings, feedbacks, deleteHotel } = useFeedback();
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'feedback' | 'qr' | 'settings'
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [businessForm, setBusinessForm] = useState({
    hotelName: settings?.hotelName || '',
    googlePlaceId: settings?.googlePlaceId || '',
    googleReviewUrl: settings?.googleReviewUrl || '',
    logoUrl: settings?.logoUrl || '',
    themeColor: settings?.themeColor || '#E11D48',
    tone: settings?.tone || 'friendly',
  });

  const [businessSaved, setBusinessSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [linkValidation, setLinkValidation] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  // Delete hotel safety state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const hotelSlug = settings?.hotelSlug || '';
  const hotelName = settings?.hotelName || settings?.name || 'Property';

  useEffect(() => {
    setBusinessForm({
      hotelName: settings?.hotelName || '',
      googlePlaceId: settings?.googlePlaceId || '',
      googleReviewUrl: settings?.googleReviewUrl || '',
      logoUrl: settings?.logoUrl || '',
      themeColor: settings?.themeColor || '#E11D48',
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
    if (hotelSlug) fetchAnalytics();
  }, [hotelSlug]);

  const handleSaveBusiness = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(businessForm);
    setIsSaving(false);
    setBusinessSaved(true);
    setTimeout(() => setBusinessSaved(false), 2200);
  };

  const handlePlaceIdChange = (val) => {
    setBusinessForm((prev) => ({ ...prev, googlePlaceId: val }));
    if (val.trim()) {
      setLinkValidation(validateGoogleReviewLink(val));
    } else {
      setLinkValidation(null);
    }
  };

  // Real-Data Calculations
  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];
  const totalReviews = safeFeedbacks.length;
  const positiveReviews = safeFeedbacks.filter((f) => f && f.rating >= 4).length;
  const negativeReviews = safeFeedbacks.filter((f) => f && f.rating <= 3).length;
  const alertCount = safeFeedbacks.filter((f) => f && f.rating <= (settings?.alertThreshold || 3) && !f.managerResolved).length;
  const avgRating = totalReviews > 0
    ? (safeFeedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / totalReviews).toFixed(1)
    : '5.0';

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  safeFeedbacks.forEach((f) => {
    if (f && f.rating && ratingCounts[f.rating] !== undefined) {
      ratingCounts[f.rating] += 1;
    }
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Dashboard Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-rose)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
            Property Management
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            {hotelName} Intelligence
          </h1>
        </div>

        {/* 4-Module Navigation Segments */}
        <div className="saas-tabs-container" style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <button
            type="button"
            className={`saas-tab-btn ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <BarChart3 size={14} />
            <span>Overview & Analytics</span>
          </button>

          <button
            type="button"
            className={`saas-tab-btn ${activeSection === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveSection('feedback')}
          >
            <MessageSquare size={14} />
            <span>Guest Feedback</span>
            {alertCount > 0 && (
              <span style={{ background: 'var(--rose-600)', color: '#fff', fontSize: '0.6875rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)' }}>
                {alertCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`saas-tab-btn ${activeSection === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveSection('qr')}
          >
            <QrCode size={14} />
            <span>QR Studio & Links</span>
          </button>

          <button
            type="button"
            className={`saas-tab-btn ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            <Sliders size={14} />
            <span>Property Settings</span>
          </button>
        </div>
      </div>

      {/* MODULE 1: OVERVIEW & REAL-DATA ANALYTICS */}
      {activeSection === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* KPI Cards Grid */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">
                <span>Average Rating</span>
                <Star size={15} color="var(--accent-gold)" fill="var(--accent-gold)" />
              </div>
              <div className="kpi-value" style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span>{avgRating}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--slate-400)', fontWeight: 500 }}>/ 5.0</span>
              </div>
              <div className="kpi-subtext">Based on {totalReviews} verified submissions</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">
                <span>Total Feedback Logged</span>
                <MessageSquare size={15} color="var(--slate-400)" />
              </div>
              <div className="kpi-value">{totalReviews}</div>
              <div className="kpi-subtext">
                Positive: <strong>{positiveReviews}</strong> · Attention: <strong>{negativeReviews}</strong>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">
                <span>Total QR Scans</span>
                <Smartphone size={15} color="var(--brand-rose)" />
              </div>
              <div className="kpi-value">{analytics?.totalScans || 0}</div>
              <div className="kpi-subtext">
                Today: <strong>{analytics?.todayScans || 0} scans</strong>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">
                <span>Google Review Clicks</span>
                <Globe size={15} color="var(--emerald-600)" />
              </div>
              <div className="kpi-value" style={{ color: 'var(--emerald-600)' }}>
                {analytics?.googleRedirects || 0}
              </div>
              <div className="kpi-subtext">High-intent 5-star submissions</div>
            </div>
          </div>

          {/* Detailed Analytics Grid: Rating Breakdown & Recent Stream */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {/* Rating Breakdown Card */}
            <div className="saas-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem' }}>
                Rating Distribution
              </h3>

              {totalReviews === 0 ? (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.875rem' }}>
                  No rating data recorded yet for this property.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = ratingCounts[stars] || 0;
                    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                    return (
                      <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem' }}>
                        <div style={{ width: '45px', fontWeight: 600, color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <span>{stars}</span>
                          <Star size={11} fill="var(--accent-gold)" color="var(--accent-gold)" />
                        </div>

                        <div style={{ flex: 1, height: '8px', background: 'var(--slate-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: stars >= 4 ? 'var(--brand-rose)' : stars === 3 ? 'var(--accent-gold)' : 'var(--slate-400)',
                              borderRadius: 'var(--radius-full)',
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>

                        <div style={{ width: '60px', textAlign: 'right', color: 'var(--slate-500)', fontWeight: 600, fontSize: '0.75rem' }}>
                          {count} ({pct}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Action & Health Overview */}
            <div className="saas-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  Property Reputation Status
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', lineHeight: '1.55', marginBottom: '1rem' }}>
                  Your Google review URL is bound to: <strong>{settings?.googleReviewUrl ? 'Active & Validated' : 'Not Configured'}</strong>.
                </p>

                <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--slate-600)' }}>Unresolved Duty Alerts:</span>
                    <strong style={{ color: alertCount > 0 ? 'var(--rose-600)' : 'var(--emerald-600)' }}>{alertCount}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--slate-600)' }}>Writing AI Assistant:</span>
                    <strong style={{ color: 'var(--slate-800)', textTransform: 'capitalize' }}>{settings?.tone || 'Friendly'} Tone</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="saas-btn saas-btn-primary"
                  onClick={() => setActiveSection('qr')}
                  style={{ flex: 1, fontSize: '0.8125rem' }}
                >
                  <QrCode size={14} />
                  <span>Open QR Studio</span>
                </button>

                <button
                  type="button"
                  className="saas-btn saas-btn-secondary"
                  onClick={() => setActiveSection('feedback')}
                  style={{ flex: 1, fontSize: '0.8125rem' }}
                >
                  <MessageSquare size={14} />
                  <span>View All Feedback</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: GUEST FEEDBACK TRAIL */}
      {activeSection === 'feedback' && (
        <FeedbackTable feedbacks={feedbacks} />
      )}

      {/* MODULE 3: QR STUDIO & LINK HUB */}
      {activeSection === 'qr' && (
        <QrStudio />
      )}

      {/* MODULE 4: PROPERTY CONFIGURATION & DANGER ZONE */}
      {activeSection === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Settings Card */}
          <div className="saas-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Building2 size={20} color="var(--brand-rose)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
                Property Profile & Settings
              </h2>
            </div>

            {businessSaved && (
              <div className="saas-badge saas-badge-success" style={{ width: '100%', padding: '0.625rem 0.875rem', marginBottom: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle2 size={16} /> Property settings updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveBusiness} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="saas-form-group">
                <label className="saas-label">Property / Company Name:</label>
                <input
                  type="text"
                  className="saas-input"
                  value={businessForm.hotelName}
                  onChange={(e) => setBusinessForm({ ...businessForm, hotelName: e.target.value })}
                  placeholder="e.g. Grand Boutique Resort"
                  required
                />
              </div>

              <div className="saas-form-group" style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                <label className="saas-label">
                  Google Place ID (Starts with <code>ChIJ...</code>):
                </label>
                <input
                  type="text"
                  className="saas-input"
                  value={businessForm.googlePlaceId}
                  onChange={(e) => handlePlaceIdChange(e.target.value)}
                  placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
                />
                {linkValidation && (
                  <div style={{ marginTop: '0.35rem', fontSize: '0.75rem', fontWeight: 600, color: linkValidation.isValid ? 'var(--emerald-700)' : 'var(--gold-800)' }}>
                    {linkValidation.message}
                  </div>
                )}
              </div>

              <div className="saas-form-group">
                <label className="saas-label">Direct Destination Review URL:</label>
                <input
                  type="url"
                  className="saas-input"
                  value={businessForm.googleReviewUrl}
                  onChange={(e) => setBusinessForm({ ...businessForm, googleReviewUrl: e.target.value })}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="saas-form-group">
                  <label className="saas-label">Brand Logo URL (Optional):</label>
                  <input
                    type="url"
                    className="saas-input"
                    value={businessForm.logoUrl}
                    onChange={(e) => setBusinessForm({ ...businessForm, logoUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="saas-form-group">
                  <label className="saas-label">Review Writing Tone:</label>
                  <select
                    className="saas-input"
                    value={businessForm.tone}
                    onChange={(e) => setBusinessForm({ ...businessForm, tone: e.target.value })}
                    style={{ fontWeight: 600 }}
                  >
                    <option value="friendly">Friendly & Warm</option>
                    <option value="professional">Professional & Formal</option>
                    <option value="luxury">Luxury & Sophisticated</option>
                    <option value="family">Family Friendly</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" className="saas-btn saas-btn-primary" disabled={isSaving}>
                  <Save size={15} />
                  <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
                </button>
              </div>
            </form>

            {/* Keyword Tags & Presets Trigger */}
            <div style={{ marginTop: '1.5rem', background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, color: 'var(--slate-900)', fontSize: '0.9375rem' }}>
                  <Tag size={16} color="var(--brand-rose)" />
                  <span>Review Highlights & Industry Templates</span>
                </div>
                <div style={{ fontSize: '0.78125rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                  Customize positive & negative keywords or load presets for Hotels, Resorts, Cafes, Dental, and Clinics.
                </div>
              </div>

              <button
                type="button"
                className="saas-btn saas-btn-secondary"
                onClick={() => setIsSettingsModalOpen(true)}
              >
                <Sparkles size={14} color="var(--brand-rose)" />
                <span>Manage Keywords</span>
              </button>
            </div>

            {/* Danger Zone: Permanent Hotel Deletion */}
            <div style={{ marginTop: '1.5rem', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, color: '#BE123C', fontSize: '0.9375rem' }}>
                    <Trash2 size={16} color="#E11D48" />
                    <span>Danger Zone — Delete Property</span>
                  </div>
                  <div style={{ fontSize: '0.78125rem', color: '#9F1239', marginTop: '0.2rem' }}>
                    Permanently delete <strong>{hotelName}</strong> and all reviews, QR data, and configurations.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { setShowDeleteConfirm(true); setDeleteConfirmText(''); setDeleteError(''); }}
                  className="saas-btn saas-btn-danger"
                >
                  <Trash2 size={14} />
                  <span>Delete Property</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="saas-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="saas-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFF1F2', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #FECDD3' }}>
              <Trash2 size={24} />
            </div>

            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', margin: '0 0 0.35rem', textAlign: 'center' }}>
              Delete "{hotelName}" Permanently
            </h2>

            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', textAlign: 'center', lineHeight: '1.55', margin: '0 0 1rem' }}>
              This will permanently remove <strong>{hotelName}</strong> across all databases. This action is irreversible.
            </p>

            {deleteError && (
              <div className="saas-badge saas-badge-danger" style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <AlertCircle size={14} /> {deleteError}
              </div>
            )}

            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
              Type <code style={{ background: 'var(--slate-100)', padding: '0.1rem 0.35rem', borderRadius: '4px', color: 'var(--brand-rose)' }}>{hotelSlug}</code> to confirm:
            </label>
            <input
              type="text"
              className="saas-input"
              value={deleteConfirmText}
              onChange={(e) => { setDeleteConfirmText(e.target.value); setDeleteError(''); }}
              placeholder={hotelSlug}
              autoFocus
              style={{
                borderColor: deleteConfirmText === hotelSlug ? 'var(--emerald-600)' : undefined,
              }}
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="saas-btn saas-btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="saas-btn saas-btn-danger-solid"
                disabled={isDeleting || deleteConfirmText !== hotelSlug}
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
                style={{ flex: 1 }}
              >
                <Trash2 size={14} />
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
