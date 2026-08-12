import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wordCount = reviewText ? reviewText.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="guest-review-editorial">
      <div className="guest-section-header">
        <div className="guest-section-title">
          Tell us about your stay
        </div>
        <div className="guest-section-subtitle">
          Share anything that made your experience memorable.
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <textarea
          className="guest-editorial-textarea"
          value={reviewText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Tell us what you enjoyed about your stay..."
          rows={4}
        />
      </div>

      <div className="guest-review-footer">
        <span style={{ fontSize: '0.75rem', color: '#78716C', fontWeight: 500 }}>
          {wordCount > 0 ? `${wordCount} words · ${reviewText.length} characters` : '0 characters'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onRefreshPhrasing && (
            <button
              type="button"
              onClick={onRefreshPhrasing}
              className="guest-ai-helper-btn"
              title="Compose review draft from your selected highlights"
            >
              <Sparkles size={13} color="#D97706" />
              <span>Create my review</span>
            </button>
          )}

          {reviewText && (
            <button
              type="button"
              onClick={handleCopy}
              className="guest-ai-helper-btn"
              style={{
                background: copied ? '#ECFDF5' : '#F5F5F4',
                color: copied ? '#047857' : '#78716C',
                borderColor: copied ? '#D1FAE5' : '#E7E5E4',
              }}
            >
              {copied ? <Check size={13} color="#047857" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
