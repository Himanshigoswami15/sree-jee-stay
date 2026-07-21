import React from 'react';
import { Sparkles, Edit3 } from 'lucide-react';

export function AutoReviewEditor({ reviewText, onTextChange, rating }) {
  if (!rating) return null;

  return (
    <div className="review-editor-section">
      <div className="section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc' }}>
          <Sparkles size={14} color="#818cf8" />
          Auto-Written Review (Editable):
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <Edit3 size={12} /> Tap to edit
        </span>
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
