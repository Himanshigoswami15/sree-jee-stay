import React from 'react';
import {
  Sparkles,
  Wifi,
  Users,
  UtensilsCrossed,
  BedDouble,
  Waves,
  Wind,
  MapPin,
  Clock,
  Award,
  Check,
  AlertCircle,
  ShieldCheck,
  Star,
  Coffee
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useFeedback } from '../../context/FeedbackContext';

function getKeywordIcon(tagId = '', label = '', category = '') {
  const lower = `${tagId} ${label} ${category}`.toLowerCase();

  if (lower.includes('clean') || lower.includes('spotless') || lower.includes('hygien')) return Sparkles;
  if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet')) return Wifi;
  if (lower.includes('staff') || lower.includes('team') || lower.includes('friendly') || lower.includes('service') || lower.includes('doctor') || lower.includes('barista')) return Users;
  if (lower.includes('breakfast') || lower.includes('food') || lower.includes('dining') || lower.includes('meal')) return UtensilsCrossed;
  if (lower.includes('coffee') || lower.includes('cafe') || lower.includes('drink')) return Coffee;
  if (lower.includes('bed') || lower.includes('sleep') || lower.includes('comfort') || lower.includes('mattress')) return BedDouble;
  if (lower.includes('pool') || lower.includes('swim')) return Waves;
  if (lower.includes('ac') || lower.includes('air condition') || lower.includes('cooling') || lower.includes('quiet')) return Wind;
  if (lower.includes('location') || lower.includes('view') || lower.includes('spot')) return MapPin;
  if (lower.includes('check-in') || lower.includes('checkin') || lower.includes('fast') || lower.includes('delay')) return Clock;
  if (lower.includes('best') || lower.includes('value') || lower.includes('top') || lower.includes('roi') || lower.includes('seo')) return Award;

  return Star;
}

export function KeywordChips({ rating, selectedTags = [], onToggleTag }) {
  const { keywords } = useFeedback();

  if (!rating) return null;

  const isPositive = rating >= 4;
  const chipList = isPositive ? (keywords?.positive || []) : (keywords?.negative || []);

  if (!chipList || chipList.length === 0) return null;

  return (
    <div style={{ margin: '1.25rem 0 1rem 0', textAlign: 'left' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.625rem',
        }}
      >
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--slate-700)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          {isPositive ? (
            <>
              <Sparkles size={14} color="var(--gold-600)" />
              <span>Select highlights of your stay</span>
            </>
          ) : (
            <>
              <AlertCircle size={14} color="var(--rose-600)" />
              <span>Select areas for improvement</span>
            </>
          )}
        </span>

        <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', fontWeight: 500 }}>
          {selectedTags.length > 0 ? `${selectedTags.length} selected` : 'Optional'}
        </span>
      </div>

      <div className="keyword-card-grid">
        {chipList.map((chip) => {
          const tagId = chip.id || chip.tagId;
          const isSelected = selectedTags.includes(tagId);
          const cleanLabel = (chip.label || tagId || '')
            .replace(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
            .replace(/^[^a-zA-Z0-9]+/, '')
            .trim();

          const IconComponent = getKeywordIcon(tagId, chip.label, chip.category);

          return (
            <motion.button
              key={tagId}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleTag(tagId)}
              className={`keyword-card-btn ${
                isSelected ? (isPositive ? 'selected' : 'selected-negative') : ''
              }`}
            >
              <IconComponent
                size={15}
                color={
                  isSelected
                    ? isPositive
                      ? 'var(--gold-700)'
                      : 'var(--rose-700)'
                    : 'var(--slate-400)'
                }
                style={{ flexShrink: 0 }}
              />

              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {cleanLabel}
              </span>

              {isSelected && (
                <Check
                  size={14}
                  color={isPositive ? 'var(--gold-700)' : 'var(--rose-700)'}
                  strokeWidth={2.5}
                  style={{ flexShrink: 0 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
