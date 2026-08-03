import React, { useState } from 'react';
import { Heart, CheckCircle2, RotateCcw, ExternalLink, Gift, Copy, Check, Sparkles } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { getActiveProviders } from '../../utils/providerRouter';

export function ThankYouCard({ rating, onReset, guestContact }) {
  const { settings } = useFeedback();
  const [copiedCode, setCopiedCode] = useState(false);

  const isHighRating = rating >= 4;
  const activeProviders = getActiveProviders(settings);
  const voucherCode = `VIP-${(settings?.hotelName || 'SREE').substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="guest-card" style={{ textAlign: 'center', padding: '2rem 1.5rem', maxWidth: '460px', margin: '1rem auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
        {/* Animated Badge */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: isHighRating
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: isHighRating ? '0 10px 25px rgba(16, 185, 129, 0.4)' : '0 10px 25px rgba(99, 102, 241, 0.4)',
            marginBottom: '0.25rem',
          }}
        >
          {isHighRating ? <CheckCircle2 size={40} /> : <Heart size={38} />}
        </div>

        <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: '1.25' }}>
          Thank You for Reviewing {settings.hotelName || 'Sree Jee Stay'}!
        </h2>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', maxWidth: '420px' }}>
          {isHighRating
            ? `Your review was submitted! We truly appreciate your support and look forward to welcoming you back.`
            : `Your private feedback has been delivered directly to our Duty Manager. We are attending to your notes immediately.`}
        </p>

        {/* VIP DIGITAL PERK VOUCHER (FOR HIGH RATING) */}
        {isHighRating && (
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #fffbe6 0%, #fef3c7 100%)',
              border: '2px dashed #f59e0b',
              borderRadius: '20px',
              padding: '1.25rem 1rem',
              margin: '0.75rem 0',
              textAlign: 'center',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.12)',
              position: 'relative',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#f59e0b',
                color: '#ffffff',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <Gift size={13} /> VIP Guest Privilege Reward
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#78350f', margin: '0 0 0.25rem' }}>
              Complimentary Welcome Drink ☕ / 10% Dining Discount
            </h3>

            <p style={{ fontSize: '0.78rem', color: '#92400e', margin: '0 0 0.85rem' }}>
              Show this voucher screen to our reception desk or dining staff to claim your special perk!
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#ffffff',
                border: '1.5px solid #fcd34d',
                borderRadius: '14px',
                padding: '0.6rem 1rem',
                margin: '0 auto',
                maxWidth: '280px',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, color: '#b45309', letterSpacing: '0.1em' }}>
                {voucherCode}
              </span>

              <button
                type="button"
                onClick={handleCopyVoucher}
                style={{
                  background: copiedCode ? '#ecfdf5' : '#fef3c7',
                  border: copiedCode ? '1px solid #6ee7b7' : '1px solid #fde68a',
                  color: copiedCode ? '#047857' : '#92400e',
                  borderRadius: '10px',
                  padding: '0.3rem 0.55rem',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                {copiedCode ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
        {activeProviders.map((provider) => (
          <button
            key={provider.type}
            type="button"
            className="btn-primary-action"
            onClick={() => window.open(provider.url, '_blank', 'noopener,noreferrer')}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <ExternalLink size={18} /> Open {provider.name} Profile
          </button>
        ))}

        <button
          type="button"
          className="btn-secondary-action"
          onClick={onReset}
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
        >
          <RotateCcw size={15} /> Submit Another Feedback
        </button>
      </div>
    </div>
  );
}

