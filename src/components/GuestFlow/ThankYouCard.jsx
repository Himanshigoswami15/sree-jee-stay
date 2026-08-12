import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, ExternalLink, Gift, Copy, Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFeedback } from '../../context/FeedbackContext';
import { getActiveProviders } from '../../utils/providerRouter';

export function ThankYouCard({ rating, onReset, guestContact }) {
  const { settings, setActiveTab } = useFeedback();
  const [copiedCode, setCopiedCode] = useState(false);

  const isHighRating = rating >= 4;
  const activeProviders = getActiveProviders(settings);
  const hotelName = settings?.hotelName || settings?.name || 'Hotel';
  const logoUrl = settings?.logoUrl || '';
  const brandColor = settings?.themeColor || '#1C1917';
  const locationText = settings?.location || 'Rajasthan · India';

  const voucherCode = `VIP-${hotelName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase() || 'STAY'}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

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
                className="hotel-hero-monogram"
                style={{ background: brandColor }}
              >
                {hotelName.charAt(0).toUpperCase()}
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
                ? `Your experience means a lot to us. We look forward to welcoming you back to ${hotelName}.`
                : `Your feedback has been delivered directly to our Duty Management team. We are actively reviewing your notes.`}
            </p>
          </div>

          {/* VIP Guest Privilege Voucher (For Positive Ratings) */}
          {isHighRating && (
            <div
              style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1rem',
                margin: '1.5rem 0',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#D97706',
                  color: '#FFFFFF',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <Gift size={12} /> VIP Guest Privilege
              </div>

              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#78350F', marginBottom: '0.25rem' }}>
                Complimentary Welcome Beverage / 10% Dining Privilege
              </div>

              <p style={{ fontSize: '0.78125rem', color: '#92400E', margin: '0 0 0.75rem' }}>
                Present this voucher code to our reception or dining staff on your next visit.
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#FFFFFF',
                  border: '1px solid #FDE68A',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.875rem',
                }}
              >
                <span style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, color: '#92400E', letterSpacing: '0.06em' }}>
                  {voucherCode}
                </span>

                <button
                  type="button"
                  onClick={handleCopyVoucher}
                  style={{
                    background: copiedCode ? '#ECFDF5' : '#FEF3C7',
                    border: copiedCode ? '1px solid #D1FAE5' : '1px solid #FDE68A',
                    color: copiedCode ? '#047857' : '#92400E',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

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
