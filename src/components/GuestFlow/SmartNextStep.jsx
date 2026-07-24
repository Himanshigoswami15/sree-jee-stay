import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ExternalLink, Copy, Check, ShieldCheck, Send, Info, Sparkles, AlertCircle, ShieldAlert, Smartphone } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { generateGoogleReviewUrl } from '../../utils/googleReview';
import { copyToMobileClipboard } from '../../utils/clipboardHelper';

export function SmartNextStep({ rating, reviewText, selectedTags, roomNumber = 'Room', onSubmitted }) {
  const { settings, addFeedback, checkIsDuplicate } = useFeedback();
  const [copied, setCopied] = useState(false);
  const [guestContact, setGuestContact] = useState('');
  const [submittedState, setSubmittedState] = useState(null); // 'google_connecting' | 'manager_sent' | 'duplicate_blocked' | null

  if (!rating) return null;

  const targetGoogleUrl = generateGoogleReviewUrl(settings.googlePlaceId || settings.googleReviewUrl);

  const isDuplicate = checkIsDuplicate(guestContact);

  const handleCopyText = async () => {
    const success = await copyToMobileClipboard(reviewText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    }
  };

  // Policy-compliant Google Review submission for ALL star ratings
  const handlePostToGoogle = async () => {
    if (isDuplicate) {
      setSubmittedState('duplicate_blocked');
      return;
    }

    // 1. MUST Copy review text to mobile clipboard FIRST (synchronously in user gesture)
    // This ensures iOS Safari & Android Chrome permit clipboard write before switching focus!
    const copiedOk = await copyToMobileClipboard(reviewText);
    if (copiedOk) {
      setCopied(true);
    }

    // 2. Save feedback in internal database first
    const result = addFeedback({
      roomNumber,
      rating,
      tags: selectedTags,
      reviewText,
      guestContact,
      postedPublic: true,
    });

    if (result && result.isDuplicate) {
      setSubmittedState('duplicate_blocked');
      return;
    }

    // 3. Synchronously open Google Review URL in new tab
    const win = window.open(targetGoogleUrl, '_blank', 'noopener,noreferrer');

    // 4. Fire confetti for positive feedback
    if (rating >= 4) {
      try {
        confetti({
          particleCount: 85,
          spread: 80,
          origin: { y: 0.55 }
        });
      } catch (e) {}
    }

    setSubmittedState('google_connecting');
    if (onSubmitted) onSubmitted();

    if (!win) {
      console.warn('Browser popup blocked; user can use fallback CTA button');
    }
  };

  // Optional manager notification for urgent low rating assistance
  const handleNotifyDutyManager = (e) => {
    e.preventDefault();

    if (isDuplicate) {
      setSubmittedState('duplicate_blocked');
      return;
    }

    const result = addFeedback({
      roomNumber,
      rating,
      tags: selectedTags,
      reviewText,
      guestContact,
      postedPublic: false,
    });

    if (result && result.isDuplicate) {
      setSubmittedState('duplicate_blocked');
      return;
    }

    setSubmittedState('manager_sent');
    if (onSubmitted) onSubmitted();
  };

  if (submittedState === 'duplicate_blocked') {
    return (
      <div style={{
        textAlign: 'center',
        padding: '1.5rem',
        background: '#fff1f2',
        borderRadius: '20px',
        border: '1px solid #fda4af',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        boxShadow: '0 8px 30px rgba(225, 29, 72, 0.1)'
      }}>
        <div style={{ color: '#e11d48', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={24} color="#e11d48" /> Multiple Reviews Blocked
        </div>
        <p style={{ fontSize: '0.875rem', color: '#9f1239', lineHeight: '1.4' }}>
          A review has already been submitted for Phone / Customer ID: <strong>{guestContact || 'this device'}</strong>.
        </p>
        <div style={{ fontSize: '0.8rem', color: '#be123c', background: '#ffe4e6', padding: '0.65rem', borderRadius: '10px' }}>
          🔒 To ensure authentic ratings, multiple reviews from a single customer ID or phone number are not accepted. Thank you for your feedback!
        </div>
      </div>
    );
  }

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

        <div style={{
          background: '#ecfdf5',
          padding: '0.9rem 1rem',
          borderRadius: '14px',
          border: '1px solid #6ee7b7',
          textAlign: 'left',
          fontSize: '0.835rem',
          color: '#065f46',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 800, fontSize: '0.925rem' }}>
            <Check size={18} color="#059669" /> Review Text Auto-Copied to Clipboard!
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857' }}>
            <span>📱</span> <strong>Mobile Phone:</strong> Tap inside Google's review box and select <strong>Paste</strong> (or tap the clipboard bar above your keyboard).
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e3a8a' }}>
            <span>💻</span> <strong>Computer:</strong> Press <strong>Ctrl + V</strong> (or <strong>Cmd + V</strong>) to paste.
          </div>
        </div>

        <button
          type="button"
          className="btn-primary-action"
          style={{ marginTop: '0.25rem' }}
          onClick={() => window.open(targetGoogleUrl, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink size={18} /> Open Google Review Page Again
        </button>
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

      {/* Helper Tip when Google Place ID is not yet configured */}
      {!settings.googlePlaceId && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '0.65rem 0.85rem',
          fontSize: '0.78rem',
          color: '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          lineHeight: '1.35'
        }}>
          <Info size={18} color="#d97706" style={{ flexShrink: 0 }} />
          <div>
            <strong>Notice:</strong> Add your <strong>Google Place ID</strong> in <strong>Manager Dashboard $\rightarrow$ Settings</strong> to open the <em>Write Review Box directly</em> instead of opening the Google Maps location overview page!
          </div>
        </div>
      )}

      {/* Guest Phone / Customer ID Verification Field */}
      <div className="form-group" style={{ marginBottom: '0.15rem' }}>
        <label className="form-label" style={{ fontSize: '0.8rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Smartphone size={14} color="#2563eb" />
          Phone Number / Customer ID (Prevents duplicate reviews):
        </label>
        <input
          type="text"
          className="form-input"
          value={guestContact}
          onChange={(e) => setGuestContact(e.target.value)}
          placeholder="e.g. 9876543210 or CUST-102"
          style={{
            fontSize: '0.875rem',
            padding: '0.6rem 0.85rem',
            borderColor: isDuplicate ? '#fca5a5' : undefined,
            background: isDuplicate ? '#fff1f2' : undefined
          }}
        />
      </div>

      {/* Duplicate Warning Card if matched */}
      {isDuplicate && (
        <div style={{
          background: '#fff1f2',
          border: '1px solid #fda4af',
          padding: '0.75rem 0.85rem',
          borderRadius: '12px',
          color: '#9f1239',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.45rem',
          lineHeight: '1.4'
        }}>
          <ShieldAlert size={18} color="#e11d48" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <strong>Duplicate Customer Blocked:</strong> A review has already been submitted for <strong>{guestContact}</strong>. Multiple submissions from the same Customer ID or phone are disabled.
          </div>
        </div>
      )}

      {/* Prominent CTA to Post on Google for ALL ratings equally */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <button
          type="button"
          className="btn-primary-action"
          onClick={handlePostToGoogle}
          disabled={isDuplicate}
          style={{
            fontSize: '1rem',
            padding: '0.9rem',
            opacity: isDuplicate ? 0.5 : 1,
            cursor: isDuplicate ? 'not-allowed' : 'pointer'
          }}
        >
          <ExternalLink size={20} />
          <span>{isDuplicate ? 'Duplicate Review Blocked' : 'Post this review on Google'}</span>
        </button>

        {/* Copy Review Text Only Button */}
        <button
          type="button"
          className="btn-secondary-action"
          onClick={handleCopyText}
          disabled={isDuplicate}
          style={{
            opacity: isDuplicate ? 0.5 : 1,
            cursor: isDuplicate ? 'not-allowed' : 'pointer'
          }}
        >
          {copied ? <Check size={16} color="#059669" /> : <Copy size={16} />}
          <span>{copied ? 'Copied Review Text!' : 'Copy Review Text to Clipboard'}</span>
        </button>
      </div>

      {/* For lower ratings (1-3 stars), offer optional callback input to Duty Manager as additional help */}
      {rating <= 3 && !isDuplicate && (
        <form onSubmit={handleNotifyDutyManager} style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px dashed #bfdbfe', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
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

