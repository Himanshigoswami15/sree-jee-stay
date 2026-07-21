import React from 'react';
import { Heart, Building2, CheckCircle2, RotateCcw, ExternalLink } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

export function ThankYouCard({ rating, onReset }) {
  const { settings } = useFeedback();

  const isHighRating = rating >= 4;

  return (
    <div className="guest-card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: isHighRating
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: isHighRating ? '0 10px 25px rgba(16, 185, 129, 0.4)' : '0 10px 25px rgba(99, 102, 241, 0.4)',
          }}
        >
          {isHighRating ? <CheckCircle2 size={36} /> : <Heart size={34} />}
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.25' }}>
          Thank You for Reviewing {settings.hotelName}!
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5', maxWidth: '480px' }}>
          {isHighRating
            ? `Your feedback has been received and copied to your clipboard. We truly appreciate your support and hope you enjoy the rest of your stay!`
            : `Your feedback has been sent directly to our Duty Manager. We are addressing your comments immediately to ensure a comfortable stay.`}
        </p>
      </div>

      {isHighRating && (
        <button
          type="button"
          className="btn-primary-action"
          onClick={() => window.open(settings.googleReviewUrl, '_blank', 'noopener,noreferrer')}
          style={{ marginBottom: '0.5rem' }}
        >
          <ExternalLink size={18} /> Open Google Review Page
        </button>
      )}

      <button
        type="button"
        className="btn-secondary-action"
        onClick={onReset}
        style={{ marginTop: '0.5rem' }}
      >
        <RotateCcw size={15} /> Submit Another Review
      </button>
    </div>
  );
}
