import React, { useState } from 'react';
import { Building2, X, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useFeedback } from '../../context/FeedbackContext';

export function HotelRegistryModal({ isOpen, onClose, onHotelOnboarded }) {
  const { refreshHotels, registerHotel } = useFeedback();

  const [form, setForm] = useState({
    name: '',
    hotelSlug: '',
    googlePlaceId: '',
    password: '1234',
    tone: 'friendly',
    secretKey: '',
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
      hotelSlug: autoSlug,
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

    // Clean input slug so it never contains protocol/domain prefix (e.g. httpsgpagerczca0--g)
    const cleanSlug = (form.hotelSlug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/[^a-z0-9-]+/g, '')
      .replace(/(^-|-$)/g, '') || 'new-business';

    if (!form.password || form.password.trim().length < 4) {
      setError('Manager Security PIN / Password must be at least 4 characters long.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      hotelSlug: cleanSlug,
      password: form.password.trim(),
    };

    try {
      const res = await apiClient('/api/hotels/onboard', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!res || !res.success) {
        setError(res?.error || 'Failed to onboard business in MongoDB Atlas.');
        return;
      }

      const finalSlug = (res && res.hotel && res.hotel.hotelSlug) ? res.hotel.hotelSlug : cleanSlug;
      const finalName = (res && res.hotel && res.hotel.name) ? res.hotel.name : form.name;

      setSuccessMsg(`🎉 Business "${finalName}" onboarded successfully!`);
      if (registerHotel) registerHotel({ hotelSlug: finalSlug, name: finalName });
      if (refreshHotels) refreshHotels();

      setTimeout(() => {
        if (onHotelOnboarded) onHotelOnboarded(finalSlug);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err?.message || 'Error onboarding business to MongoDB Atlas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-card" style={{ maxWidth: '480px', textAlign: 'left', maxHeight: '85vh', overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>
            <Building2 size={22} color="#2563eb" />
            <span>Add New Business — 2 Minute Setup</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.4', marginBottom: '1rem' }}>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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

          <div className="form-group" style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
            <label className="form-label" style={{ fontWeight: 800, color: '#1e293b' }}>
              🔒 Admin Secret Key (Required):
            </label>
            <input
              type="password"
              className="form-input"
              value={form.secretKey}
              onChange={(e) => setForm({ ...form, secretKey: e.target.value })}
              placeholder="Enter Admin Secret Key..."
              required
            />
            <span style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
              Restricted to Super Admin authorization.
            </span>
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

          {/* STICKY ACTION BUTTONS FOOTER */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', position: 'sticky', bottom: 0, background: '#ffffff', zIndex: 10 }}>
            <button
              type="button"
              className="btn-secondary-action"
              style={{ flex: 1, padding: '0.75rem' }}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary-action"
              style={{ flex: 2, padding: '0.75rem', background: '#2563eb', color: '#ffffff', fontWeight: 800, fontSize: '0.9rem' }}
              disabled={isSubmitting}
            >
              <Plus size={16} /> {isSubmitting ? 'Onboarding Business...' : 'Confirm & Onboard Business'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
