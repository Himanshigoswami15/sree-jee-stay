import React, { useState } from 'react';
import { Building2, X, Plus, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useFeedback } from '../../context/FeedbackContext';
import { extractPlaceId, validateGoogleReviewLink } from '../../utils/googleReview';

export function HotelRegistryModal({ isOpen, onClose, onHotelOnboarded }) {
  const { refreshHotels, registerHotel } = useFeedback();

  const [form, setForm] = useState({
    name: '',
    hotelSlug: '',
    googlePlaceId: '',
    password: '',
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
      secretKey: (form.secretKey || '').trim(),
      password: form.password.trim(),
    };

    try {
      const res = await apiClient('/api/hotels/onboard', {
        method: 'POST',
        headers: {
          'X-Admin-Secret-Key': (form.secretKey || '').trim(),
        },
        body: JSON.stringify(payload),
      });

      if (!res || !res.success) {
        setError(res?.error || 'Failed to onboard property.');
        return;
      }

      const finalSlug = (res && res.hotel && res.hotel.hotelSlug) ? res.hotel.hotelSlug : cleanSlug;
      const finalName = (res && res.hotel && res.hotel.name) ? res.hotel.name : form.name;

      setSuccessMsg(`Property "${finalName}" onboarded successfully!`);
      if (registerHotel) registerHotel({ hotelSlug: finalSlug, name: finalName });
      if (refreshHotels) refreshHotels();

      setTimeout(() => {
        if (onHotelOnboarded) onHotelOnboarded(finalSlug);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err?.message || 'Error onboarding property.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="saas-modal-overlay" onClick={onClose}>
      <div className="saas-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="saas-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} color="var(--brand-rose)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
              Onboard New Property
            </h3>
          </div>
          <button type="button" onClick={onClose} className="saas-btn saas-btn-ghost" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <div className="saas-card-body">
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
            Register your property to generate its custom review portal, direct Place ID routing, sentiment keywords, and printable QR code.
          </p>

          {successMsg && (
            <div className="saas-badge saas-badge-success" style={{ width: '100%', padding: '0.625rem 0.875rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          {error && (
            <div className="saas-badge saas-badge-danger" style={{ width: '100%', padding: '0.625rem 0.875rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="saas-form-group" style={{ margin: 0 }}>
                <label className="saas-label">Property Name:</label>
                <input
                  type="text"
                  className="saas-input"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Grand Resort"
                  required
                  autoFocus
                />
              </div>

              <div className="saas-form-group" style={{ margin: 0 }}>
                <label className="saas-label">Industry Category:</label>
                <select
                  className="saas-input"
                  value={form.businessType || 'hotel'}
                  onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                  style={{ fontWeight: 600 }}
                >
                  <option value="hotel">Hotel & Resort</option>
                  <option value="restaurant">Restaurant & Dining</option>
                  <option value="cafe">Cafe & Bakery</option>
                  <option value="salon">Salon & Spa</option>
                  <option value="clinic">Clinic & Healthcare</option>
                  <option value="gym">Gym & Fitness</option>
                  <option value="marketing">Marketing Agency</option>
                  <option value="other">Other Business</option>
                </select>
              </div>
            </div>

            <div className="saas-form-group" style={{ margin: 0 }}>
              <label className="saas-label">Admin Secret Key (Required):</label>
              <input
                type="password"
                className="saas-input"
                value={form.secretKey}
                onChange={(e) => setForm({ ...form, secretKey: e.target.value })}
                placeholder="Enter Admin Secret Key"
                required
              />
            </div>

            <div className="saas-form-group" style={{ margin: 0, background: 'var(--slate-50)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <label className="saas-label">Google Place ID (or Maps URL):</label>
              <input
                type="text"
                className="saas-input"
                value={form.googlePlaceId}
                onChange={(e) => setForm({ ...form, googlePlaceId: e.target.value })}
                placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
                style={{
                  borderColor: form.googlePlaceId
                    ? (extractPlaceId(form.googlePlaceId) ? 'var(--emerald-600)' : 'var(--gold-500)')
                    : undefined,
                }}
              />
              {form.googlePlaceId && (() => {
                const extracted = extractPlaceId(form.googlePlaceId);
                if (extracted) {
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--emerald-700)', fontWeight: 600 }}>
                      <CheckCircle2 size={13} color="var(--emerald-600)" />
                      <span>Valid Place ID: <code>{extracted}</code> — 1-tap review popup enabled!</span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="saas-form-group" style={{ margin: 0 }}>
                <label className="saas-label">URL Slug:</label>
                <input
                  type="text"
                  className="saas-input"
                  value={form.hotelSlug}
                  onChange={(e) => setForm({ ...form, hotelSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') })}
                  placeholder="grand-resort"
                  required
                />
              </div>

              <div className="saas-form-group" style={{ margin: 0 }}>
                <label className="saas-label">Manager PIN / Password:</label>
                <input
                  type="password"
                  className="saas-input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', marginTop: '0.875rem' }}>
              <button
                type="button"
                className="saas-btn saas-btn-secondary"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="saas-btn saas-btn-primary"
                style={{ flex: 2 }}
                disabled={isSubmitting}
              >
                <Plus size={15} />
                <span>{isSubmitting ? 'Onboarding...' : 'Onboard Property'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
