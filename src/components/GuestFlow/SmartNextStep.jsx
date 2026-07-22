import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ExternalLink, Copy, Check, ShieldCheck, Send, AlertCircle, Sparkles } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

export function SmartNextStep({ rating, reviewText, selectedTags, roomNumber = 'Room', onSubmitted }) {
  const { settings, addFeedback } = useFeedback();
  const [copied, setCopied] = useState(false);
  const [guestContact, setGuestContact] = useState('');
  const [submittedState, setSubmittedState] = useState(null); // 'manager_sent' | 'google_connecting' | null

  if (!rating) return null;

  const isHighRating = rating >= 4;

  const handleCopyText = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(reviewText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = reviewText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  const handleHighRatingSubmit = async () => {
    // Fire festive confetti for 4-5 star review!
    try {
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.55 }
      });
    } catch (e) {
      console.log('Confetti effect fired');
    }

    // Save internal feedback record
    addFeedback({
      roomNumber,
      rating,
      tags: selectedTags,
      reviewText,
      postedPublic: true,
    });

    // Auto-copy review text to device clipboard
    await handleCopyText();

    setSubmittedState('google_connecting');

    // Automatically open Google Review page directly
    setTimeout(() => {
      const win = window.open(settings.googleReviewUrl, '_blank', 'noopener,noreferrer');
      if (!win) {
        console.warn('Popup blocker prevented automatic redirection');
      }
      if (onSubmitted) onSubmitted();
    }, 300);
  };

  const handleLowRatingSubmitToManager = (e) => {
    e.preventDefault();
    addFeedback({
      roomNumber,
      rating,
      tags: selectedTags,
      reviewText,
      guestContact,
      postedPublic: false,
    });

    setSubmittedState('manager_sent');
    if (onSubmitted) onSubmitted();
  };

  const handleDirectPublicPost = async () => {
    addFeedback({
      roomNumber,
      rating,
      tags: selectedTags,
      reviewText,
      postedPublic: true,
    });

    await handleCopyText();
    setSubmittedState('google_connecting');

    setTimeout(() => {
      window.open(settings.googleReviewUrl, '_blank', 'noopener,noreferrer');
      if (onSubmitted) onSubmitted();
    }, 300);
  };

  if (submittedState === 'google_connecting') {
    return (
      <div style={{
        textAlign: 'center',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(16, 185, 129, 0.18) 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Sparkles size={24} color="#34d399" /> Opening Google Business Review Page!
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
          ✨ <strong>Your review text was automatically copied to your clipboard!</strong>
        </p>

        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '0.9rem 1rem',
          borderRadius: '14px',
          border: '1px solid var(--bg-card-border)',
          textAlign: 'left',
          fontSize: '0.825rem',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontWeight: 600 }}>
            <span>1️⃣</span> Google Review window opened in new tab automatically.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 600 }}>
            <span>2️⃣</span> Tap <strong>5 Stars</strong> on Google & paste (Ctrl+V or Long-Press) your text!
          </div>
        </div>

        <button
          type="button"
          className="btn-primary-action"
          style={{ marginTop: '0.25rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          onClick={() => window.open(settings.googleReviewUrl, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink size={18} /> Tap Here to Open Google Review Page Now
        </button>
      </div>
    );
  }

  if (submittedState === 'manager_sent') {
    return (
      <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <h3 style={{ color: '#fca5a5', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} /> Duty Manager Notified!
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Our team has been alerted immediately so we can fix this for you right away.
        </p>
        <button
          type="button"
          onClick={handleDirectPublicPost}
          className="btn-secondary-action"
          style={{ fontSize: '0.8rem' }}
        >
          <ExternalLink size={14} /> Still want to post publicly on Google?
        </button>
      </div>
    );
  }

  return (
    <div className="action-box">
      {/* Anti-gating compliance notice */}
      <div className="policy-badge">
        <ShieldCheck size={16} style={{ flexShrink: 0 }} />
        <span>
          <strong>Connected with Google:</strong> Auto-copies review text and connects directly to official Google Business Listing.
        </span>
      </div>

      {isHighRating ? (
        /* High Rating Path (4-5 Stars) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            type="button"
            className="btn-primary-action"
            onClick={handleHighRatingSubmit}
          >
            <ExternalLink size={18} />
            <span>Connect & Post on Google</span>
          </button>

          <button
            type="button"
            className="btn-secondary-action"
            onClick={handleCopyText}
          >
            {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
            <span>{copied ? 'Copied Review Text!' : 'Copy Review Text Only'}</span>
          </button>
        </div>
      ) : (
        /* Low Rating Path (1-3 Stars) */
        <form onSubmit={handleLowRatingSubmitToManager} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              Your Contact Callback Info (Optional):
            </label>
            <input
              type="text"
              className="form-input"
              value={guestContact}
              onChange={(e) => setGuestContact(e.target.value)}
              placeholder="e.g. Name or Phone #"
              style={{ fontSize: '0.85rem', padding: '0.6rem 0.85rem' }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary-action"
            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)' }}
          >
            <Send size={18} />
            <span>Send to Duty Manager (Get Immediate Fix)</span>
          </button>

          {/* Policy Compliant Secondary Link */}
          <button
            type="button"
            className="btn-secondary-action"
            onClick={handleDirectPublicPost}
            style={{ marginTop: '0.25rem' }}
          >
            <ExternalLink size={14} />
            <span>Prefer to post publicly on Google / TripAdvisor?</span>
          </button>
        </form>
      )}
    </div>
  );
}
