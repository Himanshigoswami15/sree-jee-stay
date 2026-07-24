import React, { useState, useEffect } from 'react';
import { Settings, X, Save, RotateCcw, ExternalLink, KeyRound, CheckCircle2, Globe, Sparkles, AlertTriangle, Eye, EyeOff, ShieldCheck, Mail, Phone, Building2, Search } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { extractPlaceId, generateGoogleReviewUrl, getUrlType } from '../../utils/googleReview';

export function SettingsModal({ isOpen, onClose }) {
  const { settings, updateSettings, resetToDemoData } = useFeedback();

  const [formState, setFormState] = useState(settings);
  const [showPin, setShowPin] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormState(settings);
      setSaveSuccess(false);
      setShowPin(false);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormState((prev) => ({ ...prev, [field]: val }));
  };

  const handlePlaceIdChange = (val) => {
    const cleanVal = val.trim();
    const generatedUrl = generateGoogleReviewUrl(cleanVal);

    setFormState((prev) => ({
      ...prev,
      googlePlaceId: cleanVal,
      googleReviewUrl: generatedUrl,
    }));
  };

  const handleReviewUrlChange = (val) => {
    const cleanVal = val.trim();
    const extractedId = extractPlaceId(cleanVal);
    setFormState((prev) => ({
      ...prev,
      googleReviewUrl: val,
      googlePlaceId: extractedId ? extractedId : prev.googlePlaceId,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formState);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (window.confirm('Reset all feedback submissions & settings back to initial demo data?')) {
      resetToDemoData();
      onClose();
    }
  };

  const handleTestGoogleLink = () => {
    const urlToTest = formState.googleReviewUrl || generateGoogleReviewUrl(formState.googlePlaceId);
    if (urlToTest) {
      window.open(urlToTest, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTestTripadvisorLink = () => {
    if (formState.tripadvisorReviewUrl) {
      window.open(formState.tripadvisorReviewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenPlaceIdFinder = () => {
    window.open('https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder', '_blank', 'noopener,noreferrer');
  };

  const googleUrlType = getUrlType(formState.googleReviewUrl);

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={22} color="var(--primary)" />
            <h2 className="modal-title">Google & Platform Settings</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {saveSuccess && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #6ee7b7',
            color: '#065f46',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.15)'
          }}>
            <CheckCircle2 size={22} color="#059669" />
            <div>
              <div>All Settings Updated Successfully!</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#047857', marginTop: '2px' }}>
                PIN, Hotel Name, Google & Platform Links, Contact Details and Alert Thresholds have been saved.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Hotel Name */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building2 size={15} color="#2563eb" />
              Hotel / Restaurant Name:
            </label>
            <input
              type="text"
              className="form-input"
              value={formState.hotelName || ''}
              onChange={(e) => handleChange('hotelName', e.target.value)}
              placeholder="e.g. Sree Jee Stay - Homestay in Varanasi"
              required
            />
          </div>

          {/* PIN & Alert Threshold */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={15} color="#4f46e5" />
                Manager Security PIN:
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem' }} />
                <input
                  type={showPin ? "text" : "password"}
                  maxLength={8}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', fontWeight: 800, fontSize: '1rem', letterSpacing: showPin ? '0.1em' : '0.2em' }}
                  value={formState.managerPin || ''}
                  onChange={(e) => handleChange('managerPin', e.target.value)}
                  placeholder="1234"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={showPin ? "Hide PIN" : "Show PIN"}
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                🔑 PIN used to unlock Manager Dashboard
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Alert Threshold (Stars):</label>
              <select
                className="form-input"
                value={formState.alertThreshold || 3}
                onChange={(e) => handleChange('alertThreshold', parseInt(e.target.value, 10))}
              >
                <option value={3}>≤ 3 Stars (Alert Manager)</option>
                <option value={2}>≤ 2 Stars (Urgent Only)</option>
                <option value={1}>1 Star Only</option>
              </select>
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                🚨 Ratings at or below this trigger alerts
              </span>
            </div>
          </div>

          {/* Google Place ID & Link Configuration Section */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e293b', fontWeight: 700, fontSize: '0.925rem' }}>
                <Globe size={18} color="#2563eb" />
                <span>Google Business Profile Configuration</span>
              </div>
              <button
                type="button"
                onClick={handleOpenPlaceIdFinder}
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '0.25rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Search size={12} /> Find My Google Place ID
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Google Place ID (Starts with <code>ChIJ...</code>):</label>
              <input
                type="text"
                className="form-input"
                value={formState.googlePlaceId || ''}
                onChange={(e) => handlePlaceIdChange(e.target.value)}
                placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
              />
              <span style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '0.3rem', display: 'block' }}>
                💡 <strong>Direct Review Popup requirement:</strong> Enter your 27-character Place ID (e.g. <code>ChIJ...</code>) to open the Write Review box directly!
              </span>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Generated Review Link:</label>
                <button
                  type="button"
                  onClick={handleTestGoogleLink}
                  style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.2rem 0.55rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <ExternalLink size={12} /> Test Link Now
                </button>
              </div>

              <input
                type="url"
                className="form-input"
                value={formState.googleReviewUrl || ''}
                onChange={(e) => handleReviewUrlChange(e.target.value)}
                placeholder="https://search.google.com/local/writereview?placeid=..."
                required
              />

              {/* Status Badge & Helper Notice */}
              <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
                {googleUrlType === 'direct_popup' && (
                  <span style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={14} color="#15803d" /> Direct 1-Tap Write Review Popup Enabled! (Opens 5-Star Box Directly)
                  </span>
                )}
                {googleUrlType === 'custom_url' && (
                  <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '0.35rem 0.6rem', borderRadius: '6px', fontWeight: 600, lineHeight: '1.4' }}>
                    ⚠️ <strong>Notice:</strong> This is a standard Google Maps link (opens business profile location page). To open the <strong>Write Review box DIRECTLY</strong>, click <em>"Find My Google Place ID"</em> above and paste your <code>ChIJ...</code> Place ID!
                  </span>
                )}
                {googleUrlType === 'invalid' && (
                  <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertTriangle size={12} color="#b45309" /> Please enter a valid URL (http:// or https://)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* TripAdvisor Platform Link Section */}
          <div className="form-group" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>TripAdvisor Review URL (Optional):</label>
              <button
                type="button"
                onClick={handleTestTripadvisorLink}
                style={{ background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <ExternalLink size={12} /> Test TripAdvisor Link
              </button>
            </div>
            <input
              type="url"
              className="form-input"
              value={formState.tripadvisorReviewUrl || ''}
              onChange={(e) => handleChange('tripadvisorReviewUrl', e.target.value)}
              placeholder="https://www.tripadvisor.com/UserReview..."
            />
          </div>

          {/* Duty Manager Contacts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={15} color="#0284c7" />
                Duty Manager Email:
              </label>
              <input
                type="email"
                className="form-input"
                value={formState.managerEmail || ''}
                onChange={(e) => handleChange('managerEmail', e.target.value)}
                placeholder="manager@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={15} color="#16a34a" />
                Duty Manager Phone / SMS:
              </label>
              <input
                type="text"
                className="form-input"
                value={formState.managerPhone || ''}
                onChange={(e) => handleChange('managerPhone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Anti-Duplicate Review Setting Toggle */}
          <div className="form-group" style={{ background: 'var(--bg-card-subtle, #f8fafc)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color, #e2e8f0)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main, #1e293b)' }}>
              <input
                type="checkbox"
                checked={formState.preventDuplicateReviews !== false}
                onChange={(e) => handleChange('preventDuplicateReviews', e.target.checked)}
                style={{ width: '17px', height: '17px', accentColor: '#2563eb' }}
              />
              <span>Prevent Multiple Reviews from Same Phone / Customer ID</span>
            </label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginTop: '0.25rem', display: 'block', paddingLeft: '1.75rem' }}>
              🔒 Normalizes phone numbers (e.g. +91 98765 43210 $\rightarrow$ 9876543210) & customer IDs to strictly block duplicate submissions.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary-action"
              style={{ width: 'auto', padding: '0.65rem 1rem', color: '#fca5a5' }}
              onClick={handleReset}
            >
              <RotateCcw size={14} /> Reset Demo Data
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn-secondary-action"
                style={{ width: 'auto', padding: '0.65rem 1.15rem' }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary-action"
                style={{ width: 'auto', padding: '0.65rem 1.35rem' }}
              >
                <Save size={16} /> Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
