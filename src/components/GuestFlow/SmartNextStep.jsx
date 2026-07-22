import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ExternalLink, Copy, Check, ShieldCheck, Send, Info, Sparkles, AlertCircle } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { generateGoogleReviewUrl } from '../../utils/googleReview';

export function SmartNextStep({ rating, reviewText, selectedTags, roomNumber = 'Room', onSubmitted }) {
  const { settings, addFeedback } = useFeedback();
  const [copied, setCopied] = useState(false);
  const [guestContact, setGuestContact] = useState('');
  const [submittedState, setSubmittedState] = useState(null); // 'google_connecting' | 'manager_sent' | null

  if (!rating) return null;

  const targetGoogleUrl = generateGoogleReviewUrl(settings.googlePlaceId || settings.googleReviewUrl);

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
      setTimeout(() => setCopied(false), 3500);
    } catch (err) {
      console.warn('Clipboard copy warning:', err);
    }
  };

  // Policy-compliant Google Review submission for ALL star ratings
  const handlePostToGoogle = () => {
    // 1. Synchronously open Google Review URL in new tab (bypasses popup blockers)
    const win = window.open(targetGoogleUrl, '_blank', 'noopener,noreferrer');

    // 2. Auto-copy review text to clipboard
    handleCopyText();

    // 3. Fire confetti for positive feedback
    if (rating >= 4) {
      try {
        confetti({
          particleCount: 85,
          spread: 80,
          origin: { y: 0.55 }
        });
      } catch (e) {}
    }

    // 4. Save feedback in internal database for analytics regardless of Google click
    addFeedback({
      roomNumber,
      rating,
      tags: selectedTags,
      reviewText,
      postedPublic: true,
    });

    setSubmittedState('google_connecting');
    if (onSubmitted) onSubmitted();

    if (!win) {
      console.warn('Browser popup blocked; user can use fallback CTA button');
    }
  };

  // Optional manager notification for urgent low rating assistance
  const handleNotifyDutyManager = (e) => {
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

  if (submittedState === 'google_connecting') {
    return (
      <div style={{
        textAlign: 'center',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        borderRadius: '20px',
        border: '1px solid #93c5fd',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        boxShadow: '0 8px 30px rgba(37, 99, 235, 0.12)'
      }}>
        <div style={{ color: '#059669', fontWeight: 800, fontSize: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Sparkles size={24} color="#059669" /> Google Review Page Connected!
        </div>

        <p style={{ fontSize: '0.9rem', color: '#1e3a8a', lineHeight: '1.4' }}>
          ✨ <strong>Your review text was automatically copied to your clipboard!</strong>
        </p>

        <div style={{
          background: '#ffffff',
          padding: '0.9rem 1rem',
          borderRadius: '14px',
          border: '1px solid #bfdbfe',
          textAlign: 'left',
          fontSize: '0.825rem',
          color: '#1e3a8a',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 700 }}>
            <span>1️⃣</span> Google Review window opened in new tab.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 700 }}>
            <span>2️⃣</span> Sign in to Google & paste (Ctrl+V or Long-Press) your text!
          </div>
        </div>

        <button
          type="button"
          className="btn-primary-action"
          style={{ marginTop: '0.25rem', background: 'linear-gradient(135deg, #0b192c 0%, #1e3a8a 100%)' }}
          onClick={() => window.open(targetGoogleUrl, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink size={18} /> Open Google Review Page Again
        </button>

        <div style={{ fontSize: '0.75rem', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
          <Info size={13} color="#2563eb" />
          <span>Note: You'll need to sign in with your Google account on Google to submit the review.</span>
        </div>
      </div>
    );
  }

  if (submittedState === 'manager_sent') {
    return (
      <div style={{ textAlign: 'center', padding: '1.25rem', background: '#fef2f2', borderRadius: '16px', border: '1px solid #fca5a5' }}>
        <h3 style={{ color: '#dc2626', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} /> Duty Manager Notified!
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#1e3a8a', marginBottom: '0.75rem' }}>
          Our internal team has received your feedback and will reach out immediately.
        </p>

        {/* Policy compliant equal option to post on Google */}
        <button
          type="button"
          onClick={handlePostToGoogle}
          className="btn-primary-action"
          style={{ marginTop: '0.5rem' }}
        >
          <ExternalLink size={16} /> Post this review on Google
        </button>
      </div>
    );
  }

  return (
    <div className="action-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Policy Anti-gating Notice */}
      <div className="policy-badge">
        <ShieldCheck size={16} style={{ flexShrink: 0 }} />
        <span>
          <strong>Google Policy Compliant:</strong> Direct 1-tap link to official Google Business Listing for all guests.
        </span>
      </div>

      {/* Prominent CTA to Post on Google for ALL ratings equally */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <button
          type="button"
          className="btn-primary-action"
          onClick={handlePostToGoogle}
          style={{
            background: 'linear-gradient(135deg, #0b192c 0%, #1e3a8a 100%)',
            boxShadow: '0 8px 25px rgba(11, 25, 44, 0.35)',
            fontSize: '1rem',
            padding: '0.9rem'
          }}
        >
          <ExternalLink size={20} />
          <span>Post this review on Google</span>
        </button>

        {/* Copy Review Text Only Button */}
        <button
          type="button"
          className="btn-secondary-action"
          onClick={handleCopyText}
        >
          {copied ? <Check size={16} color="#059669" /> : <Copy size={16} />}
          <span>{copied ? 'Copied Review Text!' : 'Copy Review Text to Clipboard'}</span>
        </button>

        {/* Clarifying note / tooltip as required by Task 5 */}
        <div style={{
          background: '#eff6ff',
          padding: '0.65rem 0.85rem',
          borderRadius: '10px',
          border: '1px solid #bfdbfe',
          fontSize: '0.775rem',
          color: '#1e3a8a',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.4rem',
          lineHeight: '1.4'
        }}>
          <Info size={15} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Note:</strong> Clicking this will open Google in a new tab — you'll need to sign in with your Google account and submit the review there.
          </span>
        </div>
      </div>

      {/* For lower ratings (1-3 stars), offer optional callback input to Duty Manager as additional help */}
      {rating <= 3 && (
        <form onSubmit={handleNotifyDutyManager} style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px dashed #bfdbfe', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.785rem', color: '#dc2626' }}>
              Want immediate internal manager callback? (Optional):
            </label>
            <input
              type="text"
              className="form-input"
              value={guestContact}
              onChange={(e) => setGuestContact(e.target.value)}
              placeholder="e.g. Name or Room / Phone #"
              style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem' }}
            />
          </div>

          <button
            type="submit"
            className="btn-secondary-action"
            style={{ fontSize: '0.8rem', color: '#dc2626', borderColor: '#fca5a5' }}
          >
            <Send size={14} />
            <span>Notify Duty Manager Privately</span>
          </button>
        </form>
      )}
    </div>
  );
}
