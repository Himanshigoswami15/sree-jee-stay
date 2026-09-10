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
  ShieldAlert,
  Star,
  Coffee,
  ChevronDown,
  ChevronUp,
  Volume2,
  Tv,
  Car,
  Truck,
  Package,
  DollarSign,
  PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeedback } from '../../context/FeedbackContext';
import { INDUSTRY_TEMPLATES } from '../../config/industryTemplates';

function getKeywordIcon(tagId = '', label = '', category = '') {
  const lower = `${tagId} ${label} ${category}`.toLowerCase();

  if (lower.includes('truck') || lower.includes('mover') || lower.includes('relocat') || lower.includes('transit') || lower.includes('pickup')) return Truck;
  if (lower.includes('package') || lower.includes('box') || lower.includes('item') || lower.includes('furniture') || lower.includes('damage') || lower.includes('pack')) return Package;
  if (lower.includes('care') || lower.includes('scratch') || lower.includes('fragile') || lower.includes('shield')) return ShieldAlert;
  if (lower.includes('price') || lower.includes('charge') || lower.includes('cost') || lower.includes('pricing') || lower.includes('bill') || lower.includes('fee')) return DollarSign;
  if (lower.includes('phone') || lower.includes('track') || lower.includes('call') || lower.includes('communicat') || lower.includes('support')) return PhoneCall;
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

export function KeywordChips({ rating, selectedTags = [], onToggleTag, businessType = 'hotel' }) {
  const { keywords } = useFeedback();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!rating) return null;

  const isPositive = rating >= 4;
  const isHotel = ['hotel', 'unique_stay'].includes(businessType);
  const isPackers = businessType === 'packers';
  const template = INDUSTRY_TEMPLATES[businessType];

  let rawList = isPositive ? (keywords?.positive || []) : (keywords?.negative || []);

  // Safeguard: If business is not a hotel (e.g. packers), never show default hotel keywords
  if (!isHotel && template) {
    if (!isPositive) {
      const hasHotelDefaults = rawList.some((c) =>
        ['slow_wifi', 'ac_issue', 'noise', 'breakfast_cold', 'bathroom_dirty', 'keycard'].includes(c.id || c.tagId)
      );
      if (hasHotelDefaults || rawList.length === 0) {
        rawList = template.negativeKeywords || [];
      }
    } else {
      const hasHotelDefaults = rawList.some((c) =>
        ['clean', 'wifi', 'staff', 'location', 'bed', 'breakfast'].includes(c.id || c.tagId) &&
        !template.keywords?.some((k) => (k.id || k.tagId) === (c.id || c.tagId))
      );
      if (hasHotelDefaults || rawList.length === 0) {
        rawList = template.keywords || [];
      }
    }
  }

  const chipList = rawList;

  if (!chipList || chipList.length === 0) return null;

  const isDining = ['restaurant', 'cafe'].includes(businessType);
  const isMarketing = businessType === 'marketing';

  const getPositiveTitle = () => {
    if (isPackers) return 'What did you love about our packing & moving service?';
    if (businessType === 'business_consultant') return 'What did you love about our business consultancy service?';
    if (businessType === 'makeup_artist') return 'What did you love about your makeup experience?';
    if (businessType === 'nail_artist') return 'What did you love about your nail art experience?';
    if (businessType === 'clothing') return 'What did you love about our clothing store & collection?';
    if (businessType === 'financial_services') return 'What did you love about our financial advisory & services?';
    if (isMarketing) return 'What did you love about our marketing service?';
    if (isDining) return 'What did you love about your dining experience?';
    if (!isHotel) return 'What did you love about our service?';
    return 'What did you love about your stay?';
  };

  // Show top 6 items initially to avoid a "wall of keywords"
  const INITIAL_COUNT = 6;
  const visibleChips = isExpanded ? chipList : chipList.slice(0, INITIAL_COUNT);
  const remainingCount = chipList.length - INITIAL_COUNT;

  return (
    <div className="guest-highlights-section">
      <div className="guest-section-header">
        <div className="guest-section-title">
          {isPositive ? getPositiveTitle() : 'What areas need attention?'}
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
