import React, { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { copyToMobileClipboard } from '../../utils/clipboardHelper';

export function AutoReviewEditor({
  reviewText,
  onTextChange,
  rating,
  onRefreshPhrasing,
}) {
  const [copied, setCopied] = useState(false);

  if (!rating) return null;

  const handleCopy = async () => {
    if (!reviewText) return;
    const ok = await copyToMobileClipboard(reviewText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div style={{ textAlign: 'left', margin: '1.25rem 0' }}>
      {/* Section Header */}
      <div style={{ marginBottom: '0.625rem' }}>
        <div
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--slate-900)',
            letterSpacing: '-0.01em',
          }}
        >
          Tell us about your stay
        </div>
        <div style={{ fontSize: '0.78125rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
          Your feedback helps us improve and guides future guests.
        </div>
      </div>

      {/* Large Elegant Textarea */}
      <div style={{ position: 'relative' }}>
        <textarea
          className="saas-textarea"
          value={reviewText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Share your thoughts on the room, dining, service, or amenities..."
          rows={4}
          style={{
            minHeight: '110px',
            fontSize: '0.875rem',
            lineHeight: '1.6',
          }}
        />
      </div>

      {/* Bottom Bar: Character Count + AI Assistant Trigger & Copy */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 500 }}>
          {reviewText ? `${reviewText.trim().split(/\s+/).filter(Boolean).length} words · ${reviewText.length} chars` : '0 characters'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          {onRefreshPhrasing && (
            <button
              type="button"
              onClick={onRefreshPhrasing}
              className="saas-btn saas-btn-ghost"
              style={{
                padding: '0.3rem 0.625rem',
                fontSize: '0.75rem',
                color: 'var(--slate-600)',
                background: 'var(--slate-100)',
                borderRadius: 'var(--radius-sm)',
              }}
              title="Generate a fresh phrasing variation based on your selected highlights"
            >
              <Sparkles size={13} color="var(--gold-600)" />
              <span>Create review from highlights</span>
            </button>
          )}

          {reviewText && (
            <button
              type="button"
              onClick={handleCopy}
              className="saas-btn saas-btn-ghost"
              style={{
                padding: '0.3rem 0.625rem',
                fontSize: '0.75rem',
                color: copied ? 'var(--emerald-700)' : 'var(--slate-600)',
                background: copied ? 'var(--emerald-50)' : 'var(--slate-100)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {copied ? <Check size={13} color="var(--emerald-600)" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
