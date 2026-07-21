import React from 'react';
import { Tag } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

export function KeywordChips({ rating, selectedTags, onToggleTag }) {
  const { keywords } = useFeedback();

  if (!rating) return null;

  const isPositive = rating >= 4;
  const chipList = isPositive ? (keywords.positive || []) : (keywords.negative || []);

  return (
    <div className="keyword-section">
      <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Tag size={14} />
        {isPositive ? 'Tap what went great:' : 'Tap issues you experienced:'}
      </div>

      <div className="chips-grid">
        {chipList.map((chip) => {
          const isSelected = selectedTags.includes(chip.id);
          const selectedClass = isSelected
            ? isPositive
              ? 'selected-pos'
              : 'selected-neg'
            : '';

          return (
            <button
              key={chip.id}
              type="button"
              className={`chip-btn ${selectedClass}`}
              onClick={() => onToggleTag(chip.id)}
            >
              <span>{chip.label}</span>
              {isSelected && <span style={{ marginLeft: '0.2rem', fontWeight: 800 }}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
