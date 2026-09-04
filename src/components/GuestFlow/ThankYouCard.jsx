import React from 'react';
import { CheckCircle2, RotateCcw, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFeedback } from '../../context/FeedbackContext';
import { getActiveProviders } from '../../utils/providerRouter';
import { detectBusinessType } from '../../utils/reviewGenerator';

export function ThankYouCard({ rating, onReset, guestContact }) {
  const { settings } = useFeedback();

  const isHighRating = rating >= 4;
  const activeProviders = getActiveProviders(settings);
  const hotelName = settings?.hotelName || settings?.name || 'Hotel';
  const logoUrl = settings?.logoUrl || '';
  const brandColor = settings?.themeColor || '#1C1917';
  const locationText = settings?.location || 'Rajasthan · India';

  const effectiveBusinessType = detectBusinessType(settings, settings?.businessType);
  const isHotel = ['hotel', 'unique_stay'].includes(effectiveBusinessType);

  return (
    <div className="guest-page-wrapper">
      <div className="guest-container">
        <motion.div
          className="guest-luxury-card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Hotel Identity */}
          <div style={{ marginBottom: '1.5rem' }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={hotelName}
                className="hotel-hero-logo"
              />
            ) : (
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #FF0055 0%, #E11D48 50%, #BE123C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  boxShadow: '0 8px 22px rgba(225, 29, 72, 0.3)',
                  userSelect: 'none',
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {hotelName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <h1 className="hotel-hero-title">
              {hotelName}
            </h1>
            <div className="hotel-hero-location">
              {locationText}
            </div>
          </div>

          {/* Success Status Message */}
          <div style={{ margin: '1.5rem 0', padding: '1.5rem 1rem', background: '#FAFAF8', border: '1px solid var(--border-guest-subtle)', borderRadius: 'var(--radius-lg)' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: isHighRating ? '#ECFDF5' : '#F5F5F4',
                color: isHighRating ? '#047857' : '#78716C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
              }}
            >
              <CheckCircle2 size={28} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600, color: '#1C1917', margin: '0 0 0.35rem' }}>
              Thank You
            </h2>

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#78716C', lineHeight: '1.6', maxWidth: '440px', margin: '0 auto' }}>
              {isHighRating
                ? (isHotel
                    ? `Your experience means a lot to us. We look forward to welcoming you back to ${hotelName}.`
                    : `Your experience means a lot to us. We look forward to serving you again at ${hotelName}.`)
                : `Your feedback has been delivered directly to our Duty Management team. We are actively reviewing your notes.`}
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '1.5rem' }}>
            {activeProviders.map((provider) => (
              <button
                key={provider.type}
                type="button"
                className="guest-submit-cta"
                onClick={() => window.open(provider.url, '_blank', 'noopener,noreferrer')}
                style={{
                  background: brandColor,
                  color: '#FFFFFF',
                }}
              >
                <ExternalLink size={16} />
                <span>Open {provider.name} Profile</span>
              </button>
            ))}

            <button
              type="button"
              onClick={onReset}
              style={{
                height: '44px',
                background: '#FFFFFF',
                border: '1px solid #E7E5E4',
                color: '#44403C',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                marginTop: '0.25rem',
              }}
            >
              <RotateCcw size={14} />
              <span>Submit Another Note</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
