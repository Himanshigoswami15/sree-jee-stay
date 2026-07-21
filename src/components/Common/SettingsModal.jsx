import React, { useState } from 'react';
import { Settings, X, Save, RotateCcw, ExternalLink, KeyRound } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

export function SettingsModal({ isOpen, onClose }) {
  const { settings, updateSettings, resetToDemoData } = useFeedback();

  const [formState, setFormState] = useState(settings);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormState((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formState);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Reset all feedback submissions & settings back to initial demo data?')) {
      resetToDemoData();
      onClose();
    }
  };

  const handleTestGoogleLink = () => {
    if (formState.googleReviewUrl) {
      window.open(formState.googleReviewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
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

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="form-group">
            <label className="form-label">Hotel / Restaurant Name:</label>
            <input
              type="text"
              className="form-input"
              value={formState.hotelName}
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
                  value={formState.managerPin}
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
                value={formState.alertThreshold}
                onChange={(e) => handleChange('alertThreshold', parseInt(e.target.value, 10))}
              >
                <option value={3}>≤ 3 Stars (Alert Manager)</option>
                <option value={2}>≤ 2 Stars (Urgent Only)</option>
                <option value={1}>1 Star Only</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Connected Google Business Review Link:</label>
              <button
                type="button"
                onClick={handleTestGoogleLink}
                style={{ background: 'transparent', border: 'none', color: '#34d399', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <ExternalLink size={12} /> Test Google Link
              </button>
            </div>
            <input
              type="url"
              className="form-input"
              value={formState.googleReviewUrl}
              onChange={(e) => handleChange('googleReviewUrl', e.target.value)}
              placeholder="https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Duty Manager Email:</label>
              <input
                type="email"
                className="form-input"
                value={formState.managerEmail}
                onChange={(e) => handleChange('managerEmail', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duty Manager Phone / SMS:</label>
              <input
                type="text"
                className="form-input"
                value={formState.managerPhone}
                onChange={(e) => handleChange('managerPhone', e.target.value)}
              />
            </div>
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
