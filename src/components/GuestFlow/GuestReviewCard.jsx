import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Star, ShieldCheck, ExternalLink, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useFeedback } from '../../context/FeedbackContext';
import { generateReviewText, detectBusinessType } from '../../utils/reviewGenerator';
import { getActiveProviders } from '../../utils/providerRouter';
import { KeywordChips } from './KeywordChips';
import { AutoReviewEditor } from './AutoReviewEditor';
import { ThankYouCard } from './ThankYouCard';
import { copyToMobileClipboard } from '../../utils/clipboardHelper';

export function GuestReviewCard() {
  const [searchParams] = useSearchParams();
  const roomParam = searchParams.get('room') || searchParams.get('table') || '';

  const { settings, keywords, addFeedback, checkIsDuplicate } = useFeedback();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customNote, setCustomNote] = useState('');
  const [tone, setTone] = useState(settings?.tone || 'friendly');
  const [guestContact, setGuestContact] = useState('');
  const [roomNumber] = useState(roomParam);
  const [variationSeed, setVariationSeed] = useState(() => Math.random());
  const [submitted, setSubmitted] = useState(false);

  const hotelName = settings?.hotelName || settings?.name || 'Sree Jee Stay';
  const logoUrl = settings?.logoUrl || '';
  const locationText = settings?.location || 'Rajasthan · India';
  const isHighRating = rating >= 4;
  const activeProviders = getActiveProviders(settings);
  const isDuplicate = checkIsDuplicate(guestContact);

  const effectiveBusinessType = detectBusinessType(settings, settings?.businessType);
  const isPackers = effectiveBusinessType === 'packers';
  const isDining = ['restaurant', 'cafe'].includes(effectiveBusinessType);
  const isService = ['packers', 'business_consultant', 'makeup_artist', 'nail_artist', 'transfers', 'clinic', 'salon', 'gym', 'marketing', 'real_estate', 'car_rental', 'tours_travels'].includes(effectiveBusinessType);

  const getHeadingText = () => {
    if (isPackers) return 'How was your relocation experience?';
    if (effectiveBusinessType === 'business_consultant') return 'How was your consulting experience?';
    if (effectiveBusinessType === 'makeup_artist') return 'How was your makeup experience?';
    if (effectiveBusinessType === 'nail_artist') return 'How was your nail art experience?';
    if (isDining) return 'How was your dining experience?';
    if (isService) return 'How was your experience?';
    return 'How was your stay?';
  };

  const getRatingDescription = (r) => {
    if (isPackers) {
      return {
        5: "Wonderful. We're glad you had a great relocation experience.",
        4: "Very Good. Thank you for your feedback.",
        3: "Good. We appreciate your feedback.",
        2: "Fair. Tell us how we can improve.",
        1: "We're sorry your experience fell short. Please let us know.",
      }[r] || "Wonderful. We're glad you had a great relocation experience.";
    }
    if (effectiveBusinessType === 'business_consultant') {
      return {
        5: "Wonderful. We're glad you had a great business setup experience.",
        4: "Very Good. Thank you for your feedback.",
        3: "Good. We appreciate your feedback.",
        2: "Fair. Tell us how we can improve.",
        1: "We're sorry your experience fell short. Please let us know.",
      }[r] || "Wonderful. We're glad you had a great business setup experience.";
    }
    if (effectiveBusinessType === 'makeup_artist') {
      return {
        5: "Wonderful. We're glad you loved your makeup look.",
        4: "Very Good. Thank you for your feedback.",
        3: "Good. We appreciate your feedback.",
        2: "Fair. Tell us how we can improve.",
        1: "We're sorry your experience fell short. Please let us know.",
      }[r] || "Wonderful. We're glad you loved your makeup look.";
    }
    if (effectiveBusinessType === 'nail_artist') {
      return {
        5: "Wonderful. We're glad you loved your nail set.",
        4: "Very Good. Thank you for your feedback.",
        3: "Good. We appreciate your feedback.",
        2: "Fair. Tell us how we can improve.",
        1: "We're sorry your experience fell short. Please let us know.",
      }[r] || "Wonderful. We're glad you loved your nail set.";
    }
    if (isDining) {
      return {
        5: "Wonderful. We're glad you enjoyed your meal.",
        4: "Very Good. Thank you for your feedback.",
        3: "Good. We appreciate your feedback.",
        2: "Fair. Tell us how we can improve.",
        1: "We're sorry your experience fell short. Please let us know.",
      }[r] || "Wonderful. We're glad you enjoyed your meal.";
    }
    if (isService) {
      return {
        5: "Wonderful. We're glad you had a great experience with our service.",
        4: "Very Good. Thank you for your feedback.",
        3: "Good. We appreciate your feedback.",
        2: "Fair. Tell us how we can improve.",
        1: "We're sorry your experience fell short. Please let us know.",
      }[r] || "Wonderful. We're glad you had a great experience with our service.";
    }
    return {
      5: "Wonderful. We're glad you enjoyed your stay.",
      4: "Very Good. Thank you for your feedback.",
      3: "Good. We appreciate your feedback.",
      2: "Fair. Tell us how we can improve.",
      1: "We're sorry your stay fell short. Please let us know.",
    }[r] || "Wonderful. We're glad you enjoyed your stay.";
  };

  // Dynamic review text generation
  const autoGeneratedReviewText = generateReviewText({
    rating,
    selectedTags,
    customNote: '',
    hotelName,
    tone,
    reviewLength: settings?.reviewLength || 'short',
    includeEmojis: settings?.includeEmojis !== false,
    keywordsList: keywords,
    variationSeed,
    businessType: effectiveBusinessType,
  });

  const reviewText = customNote !== '' ? customNote : autoGeneratedReviewText;

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
    setCustomNote('');
    setVariationSeed(Math.random());
  };

  const handleRefreshPhrasing = () => {
    setCustomNote('');
    setVariationSeed(Math.random());
  };

  const handlePostToProvider = async (provider) => {
    if (isDuplicate) return;

    // 1. Copy review text to clipboard
    await copyToMobileClipboard(reviewText);

    // 2. Submit feedback internally
    addFeedback({
      roomNumber: roomNumber || 'Guest',
      rating,
      tags: selectedTags,
      reviewText,
      guestContact,
      postedPublic: true,
    });

    // 3. Celebratory confetti for positive rating
    if (isHighRating) {
      try {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FF0055', '#E11D48', '#F59E0B', '#10B981'],
        });
      } catch (e) {}
    }

    setSubmitted(true);

    // 4. Open destination provider popup
    if (provider?.url) {
      window.open(provider.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmitPrivateFeedback = async (e) => {
    if (e) e.preventDefault();
    if (isDuplicate) return;

    addFeedback({
      roomNumber: roomNumber || 'Guest',
      rating,
      tags: selectedTags,
      reviewText,
      guestContact,
      postedPublic: false,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <ThankYouCard
        rating={rating}
        guestContact={guestContact}
        onReset={() => {
          setSubmitted(false);
          setRating(5);
          setSelectedTags([]);
          setCustomNote('');
        }}
      />
    );
  }

  const displayedRating = hoverRating || rating;

  return (
    <div className="guest-page-wrapper">
      <div className="guest-container">
        <motion.div
          className="guest-luxury-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* 1. HERO HOTEL IDENTITY (CLEAN MONOGRAM WITHOUT FLOATING DOT) */}
          <div style={{ marginBottom: '1.25rem' }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={hotelName}
                className="hotel-hero-logo"
              />
            ) : (
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #FF0055 0%, #E11D48 50%, #BE123C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  boxShadow: '0 8px 22px rgba(225, 29, 72, 0.3)',
                  userSelect: 'none',
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {hotelName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <h1 className="hotel-hero-title">
              {hotelName}
            </h1>

            <div className="hotel-hero-location">
              {locationText}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="hotel-badge-verified">
                <ShieldCheck size={13} />
                <span>Verified Customer Experience</span>
              </span>

              {roomNumber && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#000000',
                    background: '#F1F5F9',
                    padding: '0.2rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {isPackers ? `Booking #${roomNumber}` : `Ref ${roomNumber}`}
                </span>
              )}
            </div>
          </div>

          {/* 2. ELEGANT STAR RATING INTERACTION */}
          <div className="guest-rating-section">
            <div className="guest-rating-heading">
              {getHeadingText()}
            </div>
            <div className="guest-rating-subtext">
              Your experience matters to us.
            </div>

            <div className="guest-star-row" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= displayedRating;
                return (
                  <button
                    key={star}
                    type="button"
                    className="guest-star-btn"
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => {
                      setRating(star);
                      setSelectedTags([]);
                      setCustomNote('');
                      setVariationSeed(Math.random());
                    }}
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      size={38}
                      color={isFilled ? '#F59E0B' : '#CBD5E1'}
                      fill={isFilled ? '#F59E0B' : 'transparent'}
                      strokeWidth={1.5}
                    />
                  </button>
                );
              })}
            </div>

            <div className="guest-rating-feedback-label">
              {getRatingDescription(displayedRating)}
            </div>
          </div>

          {/* 3. HIGHLIGHTS & AMENITIES SELECTION */}
          <KeywordChips
            rating={rating}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
            businessType={effectiveBusinessType}
          />

          {/* 4. WRITTEN REVIEW (GUESTBOOK EXPERIENCE) */}
          <AutoReviewEditor
            rating={rating}
            reviewText={reviewText}
            onTextChange={(val) => setCustomNote(val)}
            onRefreshPhrasing={handleRefreshPhrasing}
            businessType={effectiveBusinessType}
          />


          {/* 6. PRIMARY SUBMIT CTA WITH PROPER NON-OVERLAPPING GAP */}
          <div style={{ marginTop: '1.75rem' }}>
            {isHighRating ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activeProviders.map((provider) => (
                    <button
                      key={provider.type}
                      type="button"
                      className="guest-submit-cta"
                      onClick={() => handlePostToProvider(provider)}
                      disabled={isDuplicate}
                    >
                      <ExternalLink size={16} />
                      <span>Submit Your Review on {provider.name}</span>
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, marginTop: '0.625rem' }}>
                  Review text is automatically copied to your clipboard upon tapping.
                </div>
              </>
            ) : (
              <button
                type="button"
                className="guest-submit-cta"
                onClick={handleSubmitPrivateFeedback}
                disabled={isDuplicate}
                style={{
                  background: '#DC2626',
                  color: '#FFFFFF',
                }}
              >
                <HeartHandshake size={16} />
                <span>Submit Feedback to Duty Manager</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
