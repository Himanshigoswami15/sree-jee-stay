import React, { useState, useEffect } from 'react';
import { Building2, QrCode, Save, CheckCircle2 } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { QrStudio } from './QrStudio';
import { validateGoogleReviewLink } from '../../utils/googleReview';
import { apiClient } from '../../services/apiClient';

export function TabbedDashboard() {
  const { settings, updateSettings, feedbacks } = useFeedback();
  const [activeSection, setActiveSection] = useState('qr'); // 'qr' | 'business' | 'feedbacks'

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
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Hotel Settings'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

