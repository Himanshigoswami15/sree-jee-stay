import React, { useState, useEffect } from 'react';
import { Settings, X, Save, RotateCcw, ExternalLink, KeyRound, CheckCircle2, Globe, Sparkles, AlertTriangle } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { extractPlaceId, generateGoogleReviewUrl, getUrlType } from '../../utils/googleReview';

export function SettingsModal({ isOpen, onClose }) {
  const { settings, updateSettings, resetToDemoData } = useFeedback();

  const [formState, setFormState] = useState(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormState(settings);
      setSaveSuccess(false);
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
    }, 800);
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
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            <CheckCircle2 size={18} color="#059669" />
            <span>Settings saved successfully! Updating system...</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="form-group">
            <label className="form-label">Hotel / Restaurant Name:</label>
            <input
              type="text"
              className="form-input"
              value={formState.hotelName || ''}
              onChange={(e) => handleChange('hotelName', e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Manager Security PIN:</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem' }} />
                <input
                  type="text"
                  maxLength={6}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', fontWeight: 700 }}
                  value={formState.managerPin || ''}
                  onChange={(e) => handleChange('managerPin', e.target.value)}
                  placeholder="1234"
                  required
                />
              </div>
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
            </div>
          </div>

          {/* Google Place ID & Link Configuration Section */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e293b', fontWeight: 700, fontSize: '0.925rem' }}>
              <Globe size={18} color="#2563eb" />
              <span>Google Business Profile Configuration</span>
            </div>

            <div className="form-group">
              <label className="form-label">Google Place ID (or Google Maps link):</label>
              <input
                type="text"
                className="form-input"
                value={formState.googlePlaceId || ''}
                onChange={(e) => handlePlaceIdChange(e.target.value)}
                placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4 or https://g.page/r/..."
              />
              <span style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '0.3rem', display: 'block' }}>
                💡 <strong>Tip:</strong> Paste your official Google Place ID (e.g. <code>ChIJ...</code>) or your Google Maps listing URL.
              </span>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Google Business Review URL:</label>
                <button
                  type="button"
                  onClick={handleTestGoogleLink}
                  style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.2rem 0.55rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <ExternalLink size={12} /> Test Google Link
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

              {/* Status Badge */}
              <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                {googleUrlType === 'direct_popup' && (
                  <span style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles size={12} color="#15803d" /> Direct Write Review Popup Link
                  </span>
                )}
                {googleUrlType === 'custom_url' && (
                  <span style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Globe size={12} color="#1d4ed8" /> Custom Google Listing Link
                  </span>
                )}
                {googleUrlType === 'invalid' && (
                  <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertTriangle size={12} color="#b45309" /> Please enter a full HTTP/HTTPS URL
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Additional Review Platforms Section */}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Duty Manager Email:</label>
              <input
                type="email"
                className="form-input"
                value={formState.managerEmail || ''}
                onChange={(e) => handleChange('managerEmail', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duty Manager Phone / SMS:</label>
              <input
                type="text"
                className="form-input"
                value={formState.managerPhone || ''}
                onChange={(e) => handleChange('managerPhone', e.target.value)}
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
