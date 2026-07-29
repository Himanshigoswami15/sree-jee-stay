import React, { useState } from 'react';
import { Building2, X, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useFeedback } from '../../context/FeedbackContext';

export function HotelRegistryModal({ isOpen, onClose, onHotelOnboarded }) {
  const { refreshHotels } = useFeedback();

  const [form, setForm] = useState({
    name: '',
    hotelSlug: '',
    googlePlaceId: '',
    password: '1234',
    tone: 'friendly',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleNameChange = (val) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm((prev) => ({
      ...prev,
      name: val,
      hotelSlug: prev.hotelSlug || autoSlug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Business Name is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await apiClient('/api/hotels/onboard', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (res.success && res.hotel) {
        setSuccessMsg(`🎉 Business "${res.hotel.name}" onboarded in under 2 minutes!`);
        if (refreshHotels) refreshHotels();
        setTimeout(() => {
          if (onHotelOnboarded) onHotelOnboarded(res.hotel.hotelSlug);
          onClose();
        }, 1500);
      } else {
        setError(res.error || 'Failed to onboard business.');
      }
    } catch (err) {
      setError('Network error while onboarding business.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '480px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>
            <Building2 size={22} color="#2563eb" />
            <span>Add New Business — 2 Minute Setup</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.4', marginBottom: '1.25rem' }}>
          Paste your Google Place ID and click Onboard. The system automatically creates your review profile, direct Google link, sentiment tags, and permanent QR code!
        </p>

        {successMsg && (
          <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={16} color="#059669" /> {successMsg}
          </div>
        )}

        {error && (
          <div style={{ background: '#fff1f2', border: '1px solid #fda4af', color: '#be123c', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
            <AlertCircle size={16} color="#e11d48" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 800 }}>Business Name:</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Downtown Cafe / Artisan Salon / Hotel Paradise"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 800 }}>Google Place ID (or Maps URL):</label>
            <input
              type="text"
              className="form-input"
              value={form.googlePlaceId}
              onChange={(e) => setForm({ ...form, googlePlaceId: e.target.value })}
              placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
            />
            <span style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
              💡 Enables direct 1-tap 5-star Google review popup for customers!
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 800 }}>Clean URL Slug:</label>
              <input
                type="text"
                className="form-input"
                value={form.hotelSlug}
                onChange={(e) => setForm({ ...form, hotelSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') })}
                placeholder="downtown-cafe"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 800 }}>Dashboard PIN:</label>
              <input
                type="password"
                className="form-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="1234"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary-action"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary-action"
              style={{ flex: 2 }}
              disabled={isSubmitting}
            >
              <Plus size={16} /> {isSubmitting ? 'Onboarding Business...' : 'Create Business QR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
