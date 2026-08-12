import React, { useState } from 'react';
import { Heart, CheckCircle2, RotateCcw, ExternalLink, Gift, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFeedback } from '../../context/FeedbackContext';
import { getActiveProviders } from '../../utils/providerRouter';

export function ThankYouCard({ rating, onReset, guestContact }) {
  const { settings } = useFeedback();
  const [copiedCode, setCopiedCode] = useState(false);

  const isHighRating = rating >= 4;
  const activeProviders = getActiveProviders(settings);
  const hotelName = settings?.hotelName || settings?.name || 'Us';
  const voucherCode = `VIP-${hotelName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase() || 'STAY'}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <motion.div
      className="guest-portal-card"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
        {/* Status Indicator Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isHighRating ? 'var(--emerald-50)' : 'var(--slate-100)',
            border: isHighRating ? '1px solid var(--emerald-100)' : '1px solid var(--slate-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isHighRating ? 'var(--emerald-600)' : 'var(--slate-700)',
          }}
        >
          {isHighRating ? <CheckCircle2 size={32} /> : <Heart size={28} />}
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', margin: '0 0 0.375rem' }}>
            Thank You for Reviewing {hotelName}
          </h2>

          <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: '1.55', maxWidth: '420px', margin: '0 auto' }}>
            {isHighRating
              ? `Your review has been successfully prepared. We truly appreciate your patronage and look forward to welcoming you back.`
              : `Your private feedback has been delivered directly to our Duty Management team. We are actively reviewing your notes.`}
          </p>
        </div>

        {/* VIP Digital Privilege Voucher */}
        {isHighRating && (
          <div
            style={{
              width: '100%',
              background: 'var(--gold-50)',
              border: '1px solid var(--gold-200)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.125rem 1rem',
              margin: '0.5rem 0',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'var(--gold-600)',
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
              <Gift size={12} /> VIP Guest Privilege Reward
            </div>

            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--gold-800)', marginBottom: '0.2rem' }}>
              Complimentary Welcome Beverage / 10% Dining Perk
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--gold-700)', margin: '0 0 0.75rem' }}>
              Present this digital voucher code to our reception or dining staff upon your next visit.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#FFFFFF',
                border: '1px solid var(--gold-200)',
                borderRadius: 'var(--radius-md)',
                padding: '0.4rem 0.75rem',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--gold-800)', letterSpacing: '0.06em' }}>
                {voucherCode}
              </span>

              <button
                type="button"
                onClick={handleCopyVoucher}
                className="saas-btn"
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.7rem',
                  background: copiedCode ? 'var(--emerald-50)' : 'var(--gold-100)',
                  border: copiedCode ? '1px solid var(--emerald-100)' : '1px solid var(--gold-200)',
                  color: copiedCode ? 'var(--emerald-700)' : 'var(--gold-800)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        {activeProviders.map((provider) => (
          <button
            key={provider.type}
            type="button"
            className="saas-btn saas-btn-primary"
            onClick={() => window.open(provider.url, '_blank', 'noopener,noreferrer')}
            style={{ width: '100%', height: '44px', justifyContent: 'center' }}
          >
            <ExternalLink size={16} />
            <span>Open {provider.name} Profile</span>
          </button>
        ))}

        <button
          type="button"
          className="saas-btn saas-btn-secondary"
          onClick={onReset}
          style={{ width: '100%', height: '40px', justifyContent: 'center', marginTop: '0.25rem' }}
        >
          <RotateCcw size={14} />
          <span>Submit Another Response</span>
        </button>
      </div>
    </motion.div>
  );
}
