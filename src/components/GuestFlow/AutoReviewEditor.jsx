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
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <motion.div
      className="review-editor-section"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#ffffff',
        border: '1px solid #E5E7EB',
        borderRadius: '18px',
        padding: '1.25rem',
        textAlign: 'left',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        marginTop: '1.25rem',
      }}
    >
      {/* Header with Title & Action */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.85rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Sparkles size={16} color="#2563EB" />
          <span>AI Auto-Written Review</span>
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {onRefreshPhrasing && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={onRefreshPhrasing}
              style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#1D4ED8',
                borderRadius: '9999px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
              title="Generate another natural phrasing variation"
            >
              <RefreshCw size={12} />
              <span>Magic Rewrite</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={handleCopy}
            style={{
              background: copied ? '#ECFDF5' : '#F3F4F6',
              border: copied ? '1px solid #A7F3D0' : '1px solid #E5E7EB',
              color: copied ? '#15803D' : '#374151',
              borderRadius: '9999px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 600,
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? <Check size={13} color="#22C55E" /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </motion.button>
        </div>
      </div>

      {/* Editable Text Box */}
      <textarea
        className="review-textarea"
        value={reviewText}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Your personalized review text will appear here automatically based on your selections..."
        style={{
          width: '100%',
          minHeight: '110px',
          fontSize: '0.9rem',
          lineHeight: '1.55',
          fontWeight: '400',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxSizing: 'border-box',
          color: '#111827',
          background: '#FAFAFB',
          resize: 'vertical',
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'all 0.2s ease',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#6B7280',
          marginTop: '0.4rem',
          fontWeight: 500,
        }}
      >
        <span>💡 Tap text to edit freely before posting</span>
        <span>{reviewText.length} characters</span>
      </div>
    </motion.div>
  );
}


