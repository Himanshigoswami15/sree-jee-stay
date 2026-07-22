import React from 'react';
import { Sparkles, Edit3, RefreshCw } from 'lucide-react';

export function AutoReviewEditor({ reviewText, onTextChange, rating, onRefreshPhrasing }) {
  if (!rating) return null;

  return (
    <div className="review-editor-section">
      <div className="section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0b192c', fontWeight: 800 }}>
          <Sparkles size={14} color="#1d4ed8" />
          Auto-Written Review (Editable):
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {onRefreshPhrasing && (
            <button
              type="button"
              onClick={onRefreshPhrasing}
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                borderRadius: '6px',
                padding: '0.2rem 0.55rem',
                fontSize: '0.725rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontWeight: 700
              }}
              title="Generate a unique new sentence variation"
            >
              <RefreshCw size={11} /> Unique Phrasing
            </button>
          )}

          <span style={{ fontSize: '0.725rem', color: '#1e3a8a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Edit3 size={11} /> Tap to edit
          </span>
        </div>
      </div>

      <textarea
        className="review-textarea"
        value={reviewText}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Tap keyword chips above or type your personal notes here..."
      />
    </div>
  );
}
