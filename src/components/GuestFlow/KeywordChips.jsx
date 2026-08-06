import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className="keyword-section" style={{ margin: '1.25rem 0 0.75rem 0' }}>
      <div
        className="section-label"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#6B7280',
          marginBottom: '0.75rem',
        }}
      >
        {isPositive ? (
          <>
            <Sparkles size={15} color="#22C55E" />
            <span>Tap what you loved most about your stay:</span>
          </>
        ) : (
          <>
            <AlertCircle size={15} color="#F59E0B" />
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
          const tagId = chip.id || chip.tagId;
          const isSelected = selectedTags.includes(tagId);
          const icon = TAG_ICONS[tagId] || (isPositive ? '👍' : '💬');

          return (
            <motion.button
              key={tagId}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onToggleTag(tagId)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8125rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '9999px',
                border: isSelected
                  ? isPositive
                    ? '1.5px solid #22C55E'
                    : '1.5px solid #EF4444'
                  : '1px solid #E5E7EB',
                background: isSelected
                  ? isPositive
                    ? '#ECFDF5'
                    : '#FEF2F2'
                  : '#F3F4F6',
                color: isSelected
                  ? isPositive
                    ? '#15803D'
                    : '#B91C1C'
                  : '#374151',
                fontWeight: isSelected ? 600 : 500,
                boxShadow: isSelected
                  ? isPositive
                    ? '0 2px 8px rgba(34, 197, 94, 0.12)'
                    : '0 2px 8px rgba(239, 68, 68, 0.12)'
                  : '0 1px 2px rgba(0, 0, 0, 0.02)',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
              }}
            >
              <span style={{ fontSize: '0.875rem' }}>{icon}</span>
              <span>{chip.label.replace(/^[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]\s*/u, '')}</span>
              {isSelected && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, marginLeft: '0.15rem' }}>✓</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}


