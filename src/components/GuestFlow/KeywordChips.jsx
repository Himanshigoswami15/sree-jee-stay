import React, { useState } from 'react';
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
  Coffee,
  ChevronDown,
  ChevronUp,
  Volume2,
  Tv,
  Car
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeedback } from '../../context/FeedbackContext';

function getKeywordIcon(tagId = '', label = '', category = '') {
  const lower = `${tagId} ${label} ${category}`.toLowerCase();

  if (lower.includes('clean') || lower.includes('spotless') || lower.includes('hygien')) return Sparkles;
  if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet')) return Wifi;
  if (lower.includes('staff') || lower.includes('team') || lower.includes('friendly') || lower.includes('service') || lower.includes('doctor') || lower.includes('reception') || lower.includes('hospitality')) return Users;
  if (lower.includes('breakfast') || lower.includes('food') || lower.includes('dining') || lower.includes('meal') || lower.includes('cuisine') || lower.includes('restaurant')) return UtensilsCrossed;
  if (lower.includes('coffee') || lower.includes('cafe') || lower.includes('beverage') || lower.includes('drink')) return Coffee;
  if (lower.includes('bed') || lower.includes('sleep') || lower.includes('comfort') || lower.includes('mattress') || lower.includes('linen')) return BedDouble;
  if (lower.includes('pool') || lower.includes('swim') || lower.includes('spa')) return Waves;
  if (lower.includes('ac') || lower.includes('air condition') || lower.includes('cooling') || lower.includes('quiet') || lower.includes('peace') || lower.includes('ambien')) return Wind;
  if (lower.includes('location') || lower.includes('view') || lower.includes('spot') || lower.includes('scenery') || lower.includes('central')) return MapPin;
  if (lower.includes('check-in') || lower.includes('checkin') || lower.includes('fast') || lower.includes('quick') || lower.includes('delay') || lower.includes('timing')) return Clock;
  if (lower.includes('best') || lower.includes('value') || lower.includes('top') || lower.includes('luxur') || lower.includes('premium')) return Award;
  if (lower.includes('noise') || lower.includes('loud') || lower.includes('sound')) return Volume2;
  if (lower.includes('tv') || lower.includes('entertainment')) return Tv;
  if (lower.includes('parking') || lower.includes('valet') || lower.includes('cab')) return Car;

  return Star;
}

export function KeywordChips({ rating, selectedTags = [], onToggleTag }) {
  const { keywords } = useFeedback();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!rating) return null;

  const isPositive = rating >= 4;
  const chipList = isPositive ? (keywords?.positive || []) : (keywords?.negative || []);

  if (!chipList || chipList.length === 0) return null;

  // Show top 6 items initially to avoid a "wall of keywords"
  const INITIAL_COUNT = 6;
  const visibleChips = isExpanded ? chipList : chipList.slice(0, INITIAL_COUNT);
  const remainingCount = chipList.length - INITIAL_COUNT;

  return (
    <div className="guest-highlights-section">
      <div className="guest-section-header">
        <div className="guest-section-title">
          {isPositive ? 'What did you love about your stay?' : 'What areas need attention?'}
        </div>
        <div className="guest-section-subtitle">
          {isPositive
            ? 'Select everything that made your experience memorable.'
            : 'Select any specific issues so we can address them immediately.'}
        </div>
      </div>

      <div className="guest-highlights-grid">
        {visibleChips.map((chip) => {
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
              className={`guest-highlight-chip ${
                isSelected ? (isPositive ? 'selected' : 'selected-negative') : ''
              }`}
              aria-pressed={isSelected}
            >
              <IconComponent
                size={16}
                color={
                  isSelected
                    ? isPositive
                      ? '#E11D48'
                      : '#BE123C'
                    : '#334155'
                }
                style={{ flexShrink: 0 }}
              />

              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isSelected ? (isPositive ? '#BE123C' : '#BE123C') : '#000000', fontWeight: isSelected ? 700 : 600 }}>
                {cleanLabel}
              </span>

              {isSelected && (
                <Check
                  size={15}
                  color={isPositive ? '#E11D48' : '#BE123C'}
                  strokeWidth={2.5}
                  style={{ flexShrink: 0 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {chipList.length > INITIAL_COUNT && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="guest-expand-btn"
        >
          {isExpanded ? (
            <>
              <span>Show less highlights</span>
              <ChevronUp size={14} />
            </>
          ) : (
            <>
              <span>View all highlights (+{remainingCount} more)</span>
              <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
