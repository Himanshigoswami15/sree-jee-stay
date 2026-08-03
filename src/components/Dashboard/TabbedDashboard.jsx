import React, { useState, useEffect } from 'react';
import { Building2, QrCode, MessageSquare, BarChart3, Download, Printer, Save, CheckCircle2, Globe, ExternalLink, Sparkles, Star, Smartphone, Copy, Check } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { QrStudio } from './QrStudio';
import { KeywordStudio } from './KeywordStudio';
import { validateGoogleReviewLink } from '../../utils/googleReview';
import { apiClient } from '../../services/apiClient';

export function TabbedDashboard() {
  const { settings, updateSettings, feedbacks } = useFeedback();
  const [activeSection, setActiveSection] = useState('business'); // 'business' | 'qr' | 'reviews' | 'analytics'

  // Business Profile Form State
  const [businessForm, setBusinessForm] = useState({
    hotelName: settings?.hotelName || '',
    googlePlaceId: settings?.googlePlaceId || '',
    logoUrl: settings?.logoUrl || '',
    themeColor: settings?.themeColor || '#2563eb',
    tone: settings?.tone || 'friendly',
  });
  const [businessSaved, setBusinessSaved] = useState(false);
  const [linkValidation, setLinkValidation] = useState(null);

  // Scan Analytics State
  const [analytics, setAnalytics] = useState({
    totalScans: 0,
    todayScans: 0,
    googleRedirects: 0,
    conversionRate: 0,
  });

  const hotelSlug = settings?.hotelSlug || 'sree-jee-stay';

  useEffect(() => {
    setBusinessForm({
      hotelName: settings?.hotelName || '',
      googlePlaceId: settings?.googlePlaceId || '',
      logoUrl: settings?.logoUrl || '',
      themeColor: settings?.themeColor || '#2563eb',
      tone: settings?.tone || 'friendly',
    });

    if (settings?.googlePlaceId) {
      setLinkValidation(validateGoogleReviewLink(settings.googlePlaceId));
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
    await updateSettings(businessForm);
    setBusinessSaved(true);
    setTimeout(() => setBusinessSaved(false), 2500);
  };

  const handlePlaceIdChange = (val) => {
    setBusinessForm({ ...businessForm, googlePlaceId: val });
    if (val.trim()) {
      setLinkValidation(validateGoogleReviewLink(val));
    } else {
      setLinkValidation(null);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Title */}
      <div className="dashboard-header" style={{ marginBottom: '1.25rem' }}>
        <div className="dashboard-title-group">
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
            JJ Review System — Canva for Review QR Codes
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            {settings?.hotelName || 'Business'} Review Dashboard
          </h1>
        </div>

        {/* Sub-Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', background: '#f1f5f9', padding: '6px', borderRadius: '14px', border: '1px solid #e2e8f0', overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginTop: '0.85rem' }}>
          <button
            type="button"
            className={`nav-tab-btn ${activeSection === 'business' ? 'active' : ''}`}
            onClick={() => setActiveSection('business')}
            style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            <Building2 size={15} /> 1. Business Profile
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeSection === 'highlights' ? 'active' : ''}`}
            onClick={() => setActiveSection('highlights')}
            style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            <Star size={15} color="#f59e0b" fill="#f59e0b" /> 2. Review Highlights
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeSection === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveSection('qr')}
            style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            <QrCode size={15} color="#2563eb" /> 3. Print QR Poster
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSection('analytics')}
            style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            <BarChart3 size={15} color="#059669" /> 4. Scan Analytics
          </button>
        </div>
      </div>

      {/* SECTION 1: BUSINESS PROFILE */}
      {activeSection === 'business' && (
        <div className="chart-card">
          <div className="chart-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb' }}>
              <Building2 size={20} color="#2563eb" /> Business Configuration
            </span>
          </div>

          {businessSaved && (
            <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#059669" /> Business Profile Saved Successfully!
            </div>
          )}

          <form onSubmit={handleSaveBusiness} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 800 }}>Business Name:</label>
              <input
                type="text"
                className="form-input"
                value={businessForm.hotelName}
                onChange={(e) => setBusinessForm({ ...businessForm, hotelName: e.target.value })}
                placeholder="e.g. Sree Jee Stay / Artisan Cafe / Downtown Salon"
                required
              />
            </div>

            <div className="form-group" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <label className="form-label" style={{ fontWeight: 800, color: '#1e293b' }}>
                Google Place ID (Required for 1-Tap Review Popup):
              </label>
              <input
                type="text"
                className="form-input"
                value={businessForm.googlePlaceId}
                onChange={(e) => handlePlaceIdChange(e.target.value)}
                placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4 or Google Maps URL"
                required
              />

              {linkValidation && linkValidation.message && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.775rem', fontWeight: 700, color: linkValidation.isValid ? '#15803d' : '#b45309' }}>
                  {linkValidation.message}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 800 }}>Business Logo URL (Optional):</label>
                <input
                  type="url"
                  className="form-input"
                  value={businessForm.logoUrl}
                  onChange={(e) => setBusinessForm({ ...businessForm, logoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 800 }}>Brand Theme Color:</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={businessForm.themeColor}
                    onChange={(e) => setBusinessForm({ ...businessForm, themeColor: e.target.value })}
                    style={{ width: '42px', height: '42px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={businessForm.themeColor}
                    onChange={(e) => setBusinessForm({ ...businessForm, themeColor: e.target.value })}
                    style={{ flex: 1, fontWeight: 700 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary-action" style={{ width: 'auto', padding: '0.65rem 1.35rem' }}>
                <Save size={16} /> Save Business Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 2: REVIEW HIGHLIGHTS */}
      {activeSection === 'highlights' && (
        <KeywordStudio />
      )}

      {/* SECTION 3: PRINT QR POSTER */}
      {activeSection === 'qr' && (
        <QrStudio />
      )}

      {/* SECTION 3: REVIEWS & PREVIEW */}
      {activeSection === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="chart-card">
            <div className="chart-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a' }}>
                <Globe size={20} color="#16a34a" /> Direct Google Write Review Link
              </span>
              <a
                href={settings.googleReviewUrl || 'https://g.page/r/CTERYeDefsTREAE/review'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
              >
                <ExternalLink size={14} /> Test Direct Link Now
              </a>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Generated Direct Google Review URL:</label>
              <input
                type="text"
                className="form-input"
                readOnly
                value={settings.googleReviewUrl || 'https://search.google.com/local/writereview?placeid=...'}
                style={{ background: '#f8fafc', fontWeight: 600 }}
              />
            </div>
          </div>

          {/* Live Review Profile Preview Frame */}
          <div className="chart-card">
            <div className="chart-title">
              <span style={{ fontWeight: 800 }}>📱 Live Customer Review Profile Preview</span>
            </div>

            <div style={{ maxWidth: '420px', margin: '0 auto', background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem 1.5rem', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 0.75rem', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: settings.themeColor || '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, margin: '0 auto 0.75rem' }}>
                  {(settings.hotelName || 'B')[0]}
                </div>
              )}

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
                {settings.hotelName || 'Sree Jee Stay'}
              </h3>

              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '1.25rem' }}>
                We'd love your feedback!
              </div>

              <div style={{ fontSize: '1.75rem', letterSpacing: '4px', marginBottom: '1.25rem', cursor: 'pointer' }}>
                ⭐⭐⭐⭐⭐
              </div>

              <a
                href={settings.googleReviewUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-action"
                style={{ textDecoration: 'none', display: 'inline-flex', justifyContent: 'center', padding: '0.75rem 1.25rem', borderRadius: '12px' }}
              >
                <Star size={16} fill="white" /> Leave a Google Review
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: MINIMAL SCAN ANALYTICS */}
      {activeSection === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="metric-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ color: '#64748b', fontSize: '0.825rem', fontWeight: 800 }}>Scans Today</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#2563eb', marginTop: '0.35rem' }}>
                {analytics.todayScans || 0}
              </div>
            </div>

            <div className="metric-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ color: '#64748b', fontSize: '0.825rem', fontWeight: 800 }}>Total Scans</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
                {analytics.totalScans || 0}
              </div>
            </div>

            <div className="metric-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ color: '#64748b', fontSize: '0.825rem', fontWeight: 800 }}>Google Clicks</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem' }}>
                {analytics.googleRedirects || 0}
              </div>
            </div>

            <div className="metric-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ color: '#64748b', fontSize: '0.825rem', fontWeight: 800 }}>Conversion Rate</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#4f46e5', marginTop: '0.35rem' }}>
                {analytics.conversionRate || 0}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
