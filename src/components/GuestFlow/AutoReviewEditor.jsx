import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { copyToMobileClipboard } from '../../utils/clipboardHelper';

export function AutoReviewEditor({
  reviewText,
  onTextChange,
  rating,
  onRefreshPhrasing,
  businessType = 'hotel',
}) {
  const [copied, setCopied] = useState(false);

  if (!rating) return null;

  const isHotel = ['hotel', 'unique_stay'].includes(businessType);
  const isPackers = businessType === 'packers';
  const isDining = ['restaurant', 'cafe'].includes(businessType);
  const isMarketing = businessType === 'marketing';

  const getEditorTitle = () => {
    if (isPackers) return 'Tell us about your relocation experience';
    if (businessType === 'business_consultant') return 'Tell us about your business setup experience';
    if (businessType === 'makeup_artist') return 'Tell us about your makeup experience';
    if (businessType === 'nail_artist') return 'Tell us about your nail art experience';
    if (businessType === 'clothing') return 'Tell us about your shopping experience';
    if (businessType === 'financial_services') return 'Tell us about your financial advisory experience';
    if (isMarketing) return 'Tell us about your marketing experience';
    if (isDining) return 'Tell us about your visit';
    if (!isHotel) return 'Tell us about your experience';
    return 'Tell us about your stay';
  };

  const isPositive = rating >= 4;

  const getEditorPlaceholder = () => {
    if (!isPositive) {
      if (isPackers) return 'Tell us what could have been handled better during your relocation...';
      if (businessType === 'business_consultant') return 'Tell us what could have been handled better with your business setup...';
      if (businessType === 'makeup_artist') return 'Tell us how your makeup experience could be improved...';
      if (businessType === 'nail_artist') return 'Tell us how your nail art experience could be improved...';
      if (businessType === 'clothing') return 'Tell us how your shopping experience could be improved...';
      if (businessType === 'financial_services') return 'Tell us how our financial advisory could be improved...';
      if (isMarketing) return 'Tell us how our marketing service could be improved...';
      if (isDining) return 'Tell us what could have been better during your meal...';
      if (!isHotel) return 'Tell us how we can improve our service...';
      return 'Tell us how we can improve your stay...';
    }

    if (isPackers) return 'Tell us what you enjoyed about our packing & moving service...';
    if (businessType === 'business_consultant') return 'Tell us what you enjoyed about our consultancy service...';
    if (businessType === 'makeup_artist') return 'Tell us what you loved about your makeup and look...';
    if (businessType === 'nail_artist') return 'Tell us what you loved about your nail set and design...';
    if (businessType === 'clothing') return 'Tell us what you loved about our collection, fabric quality & service...';
    if (businessType === 'financial_services') return 'Tell us what you appreciated about our financial guidance & advisory...';
    if (isMarketing) return 'Tell us what you enjoyed about our marketing service...';
    if (isDining) return 'Tell us what you enjoyed about your meal and visit...';
    if (!isHotel) return 'Tell us what you enjoyed about our service...';
    return 'Tell us what you enjoyed about your stay...';
  };

  const title = getEditorTitle();
  const placeholder = getEditorPlaceholder();

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
          {title}
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
          placeholder={placeholder}
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
