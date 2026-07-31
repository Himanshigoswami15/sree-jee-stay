import React from 'react';
import { Tag, Sparkles, AlertCircle } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

const TAG_ICONS = {
  clean: '✨',
  wifi: '⚡',
  staff: '😊',
  breakfast: '🥐',
  bed: '🛏️',
  pool: '🏊',
  ac: '❄️',
  location: '📍',
  value: '💎',
  ambience: '🌿',
  room_dirty: '🧹',
  slow_wifi: '🐌',
  rude_staff: '⚠️',
  bad_food: '🍲',
  noisy: '🔊',
  ac_fault: '🌡️',
  maintenance: '🛠️'
};

export function KeywordChips({ rating, selectedTags = [], onToggleTag }) {
  const { keywords } = useFeedback();

  if (!rating) return null;

  const isPositive = rating >= 4;
  const chipList = isPositive ? (keywords?.positive || []) : (keywords?.negative || []);

  return (
    <div className="keyword-section" style={{ margin: '1rem 0 0.5rem 0' }}>
      <div
        className="section-label"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          fontSize: '0.825rem',
          fontWeight: 700,
          color: '#475569',
          marginBottom: '0.75rem',
        }}
      >
        {isPositive ? (
          <>
            <Sparkles size={15} color="#10b981" />
            <span>Tap what you loved most about your stay:</span>
          </>
        ) : (
          <>
            <AlertCircle size={15} color="#f59e0b" />
            <span>Tap areas that need immediate attention:</span>
          </>
        )}
      </div>

      <div
        className="chips-grid"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center',
        }}
      >
        {chipList.map((chip) => {
          const isSelected = selectedTags.includes(chip.id);
          const icon = TAG_ICONS[chip.id] || (isPositive ? '👍' : '💬');

          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onToggleTag(chip.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '24px',
                border: isSelected
                  ? isPositive
                    ? '1.5px solid #10b981'
                    : '1.5px solid #ef4444'
                  : '1px solid #cbd5e1',
                background: isSelected
                  ? isPositive
                    ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                    : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
                  : '#ffffff',
                color: isSelected
                  ? isPositive
                    ? '#047857'
                    : '#b91c1c'
                  : '#334155',
                fontWeight: isSelected ? 800 : 600,
                boxShadow: isSelected
                  ? isPositive
                    ? '0 4px 12px rgba(16, 185, 129, 0.2)'
                    : '0 4px 12px rgba(239, 68, 68, 0.2)'
                  : '0 2px 6px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isSelected ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{icon}</span>
              <span>{chip.label.replace(/^[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]\s*/u, '')}</span>
              {isSelected && (
                <span style={{ fontSize: '0.75rem', fontWeight: 900, marginLeft: '0.15rem' }}>✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

