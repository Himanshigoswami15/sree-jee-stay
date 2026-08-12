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
  const voucherCode = `VIP-${(settings?.hotelName || settings?.name || 'VIP').substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <motion.div
      className="guest-card"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        textAlign: 'center',
        padding: '2rem 1.5rem',
        maxWidth: '480px',
        margin: '1.5rem auto',
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
        {/* Animated Badge */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: isHighRating ? '#ECFDF5' : '#EFF6FF',
            border: isHighRating ? '1px solid #A7F3D0' : '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isHighRating ? '#22C55E' : '#2563EB',
            marginBottom: '0.25rem',
          }}
        >
          {isHighRating ? <CheckCircle2 size={36} /> : <Heart size={34} />}
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#111827', lineHeight: '1.3', letterSpacing: '-0.02em' }}>
          Thank You for Reviewing {settings.hotelName || settings.name || 'Us'}!
        </h2>

        <p style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: '1.55', maxWidth: '420px' }}>
          {isHighRating
            ? `Your review was submitted! We truly appreciate your support and look forward to welcoming you back.`
            : `Your private feedback has been delivered directly to our Duty Manager. We are attending to your notes immediately.`}
        </p>

        {/* VIP DIGITAL PERK VOUCHER (FOR HIGH RATING) */}
        {isHighRating && (
          <div
            style={{
              width: '100%',
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
              borderRadius: '14px',
              padding: '1.25rem 1rem',
              margin: '0.75rem 0',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#F59E0B',
                color: '#ffffff',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginBottom: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <Gift size={13} /> VIP Guest Privilege Reward
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#78350F', margin: '0 0 0.25rem' }}>
              Complimentary Welcome Drink ☕ / 10% Dining Discount
            </h3>

            <p style={{ fontSize: '0.78rem', color: '#92400E', margin: '0 0 0.85rem' }}>
              Show this voucher screen to our reception desk or dining staff to claim your special perk!
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#ffffff',
                border: '1px solid #FDE68A',
                borderRadius: '10px',
                padding: '0.5rem 0.85rem',
                margin: '0 auto',
                maxWidth: '280px',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 700, color: '#B45309', letterSpacing: '0.08em' }}>
                {voucherCode}
              </span>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleCopyVoucher}
                style={{
                  background: copiedCode ? '#ECFDF5' : '#FEF3C7',
                  border: copiedCode ? '1px solid #A7F3D0' : '1px solid #FDE68A',
                  color: copiedCode ? '#15803D' : '#92400E',
                  borderRadius: '8px',
                  padding: '0.3rem 0.55rem',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                {copiedCode ? 'Copied' : 'Copy'}
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
        {activeProviders.map((provider) => (
          <motion.button
            key={provider.type}
            type="button"
            className="btn-primary-action"
            whileHover={{ translateY: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open(provider.url, '_blank', 'noopener,noreferrer')}
            style={{
              height: '48px',
              padding: '0 1.5rem',
              borderRadius: '14px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              background: '#2563EB',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: 'none',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(37, 99, 235, 0.15)',
              cursor: 'pointer',
              width: '100%',
              letterSpacing: '-0.01em',
            }}
          >
            <ExternalLink size={18} /> Post Review on {provider.name}
          </motion.button>
        ))}

        <motion.button
          type="button"
          className="btn-secondary-action"
          whileHover={{ translateY: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          style={{
            height: '44px',
            padding: '0 1.25rem',
            borderRadius: '14px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: '#ffffff',
            border: '1px solid #E5E7EB',
            color: '#374151',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            width: '100%',
            marginTop: '0.25rem',
          }}
        >
          <RotateCcw size={15} /> Submit Another Feedback
        </motion.button>
      </div>
    </motion.div>
  );
}


