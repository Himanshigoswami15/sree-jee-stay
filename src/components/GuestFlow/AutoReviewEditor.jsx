import React, { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check, SlidersHorizontal } from 'lucide-react';
import { copyToMobileClipboard } from '../../utils/clipboardHelper';

export function AutoReviewEditor({
  reviewText,
  onTextChange,
  rating,
  onRefreshPhrasing,
  currentTone = 'friendly',
  onChangeTone,
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

  const tones = [
    { id: 'friendly', label: '🌟 Warm & Detailed' },
    { id: 'short', label: '⚡ Short & Sweet' },
    { id: 'formal', label: '💼 Professional' },
  ];

  return (
    <div
      className="review-editor-section"
      style={{
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '20px',
        padding: '1.15rem',
        textAlign: 'left',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
        marginTop: '1rem',
      }}
    >
      {/* Header with Title & Action */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Sparkles size={16} color="#4f46e5" />
          <span>AI Auto-Written Review</span>
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {onRefreshPhrasing && (
            <button
              type="button"
              onClick={onRefreshPhrasing}
              style={{
                background: '#eff6ff',
                border: '1px solid #c7d2fe',
                color: '#4f46e5',
                borderRadius: '16px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontWeight: 700,
                transition: 'all 0.15s ease',
              }}
              title="Generate another natural phrasing variation"
            >
              <RefreshCw size={12} />
              <span>Magic Rewrite</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: copied ? '#ecfdf5' : '#f8fafc',
              border: copied ? '1px solid #6ee7b7' : '1px solid #cbd5e1',
              color: copied ? '#047857' : '#334155',
              borderRadius: '16px',
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 800,
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Tone Selection Pills */}
      {onChangeTone && (
        <div
          style={{
            display: 'flex',
            gap: '0.35rem',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: '0.725rem',
              fontWeight: 700,
              color: '#64748b',
              alignSelf: 'center',
              marginRight: '0.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            <SlidersHorizontal size={12} /> Vibe:
          </span>
          {tones.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChangeTone(t.id)}
              style={{
                fontSize: '0.725rem',
                padding: '0.25rem 0.55rem',
                borderRadius: '12px',
                border: currentTone === t.id ? '1.5px solid #4f46e5' : '1px solid #e2e8f0',
                background: currentTone === t.id ? '#e0e7ff' : '#f8fafc',
                color: currentTone === t.id ? '#3730a3' : '#475569',
                fontWeight: currentTone === t.id ? 800 : 600,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

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
          lineHeight: '1.5',
          fontWeight: '500',
          padding: '0.75rem 0.9rem',
          borderRadius: '12px',
          border: '1.5px solid #cbd5e1',
          boxSizing: 'border-box',
          color: '#0f172a',
          background: '#fafafa',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: '#94a3b8',
          marginTop: '0.35rem',
          fontWeight: 600,
        }}
      >
        <span>💡 Tap text to edit freely before posting</span>
        <span>{reviewText.length} characters</span>
      </div>
    </div>
  );
}

