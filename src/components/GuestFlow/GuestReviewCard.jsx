import React, { useState, useEffect } from 'react';
import { Star, Building2 } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { generateReviewText } from '../../utils/reviewGenerator';
import { KeywordChips } from './KeywordChips';
import { AutoReviewEditor } from './AutoReviewEditor';
import { SmartNextStep } from './SmartNextStep';
import { ThankYouCard } from './ThankYouCard';

export function GuestReviewCard() {
  const { settings, keywords } = useFeedback();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [variationSeed, setVariationSeed] = useState(Math.random());

  // Update auto-written review when rating, selected tags, or variation seed changes
  useEffect(() => {
    if (rating > 0) {
      const generated = generateReviewText({
        rating,
        selectedTags,
        keywordsList: keywords,
        variationSeed,
      });
      setReviewText(generated);
    } else {
      setReviewText('');
    }
  }, [rating, selectedTags, keywords, variationSeed]);

  const handleStarClick = (val) => {
    setRating(val);
    setSelectedTags([]); // Reset tags when changing sentiment
    setVariationSeed(Math.random());
  };

  const handleToggleTag = (tagId) => {
    setVariationSeed(Math.random()); // Pick fresh unique statement variation on tag click!
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleRefreshPhrasing = () => {
    setVariationSeed(Math.random());
  };

  const handleResetForm = () => {
    setRating(0);
    setSelectedTags([]);
    setReviewText('');
    setIsSubmitted(false);
    setVariationSeed(Math.random());
  };

  const getSentimentText = () => {
    const active = hoverRating || rating;
    if (!active) return 'Tap a star to rate your stay';
    if (active === 5) return '🎉 Outstanding! We appreciate your feedback.';
    if (active === 4) return '😊 Great to hear! Tell us what you loved.';
    if (active === 3) return '😐 Thanks for letting us know. How can we improve?';
    if (active === 2) return '🙁 We are sorry. Let us make this right for you.';
    return '🚨 We apologize. Our manager will fix this immediately!';
  };

  if (isSubmitted) {
    return (
      <ThankYouCard
        rating={rating}
        onReset={handleResetForm}
      />
    );
  }

  return (
    <div className="guest-card">
      {/* Clean Header without Room Number */}
      <div className="hotel-badge-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div className="hotel-info" style={{ alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontSize: '0.825rem', fontWeight: 700 }}>
            <Building2 size={14} color="#1d4ed8" /> {settings.hotelName}
          </div>
          <div className="hotel-name" style={{ fontSize: '1.25rem' }}>Guest Feedback</div>
        </div>
      </div>

      {/* Star Selector */}
      <div className="star-rating-box">
        <div className="rating-prompt">How was your stay?</div>
        <div className="stars-row">
          {[1, 2, 3, 4, 5].map((val) => {
            const isSelected = rating >= val;
            const isHovered = hoverRating >= val;
            return (
              <button
                key={val}
                type="button"
                className={`star-btn ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                onClick={() => handleStarClick(val)}
                onMouseEnter={() => setHoverRating(val)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${val} star`}
              >
                <Star />
              </button>
            );
          })}
        </div>
        <div
          className={`sentiment-label ${rating >= 4 ? 'positive' : rating > 0 ? 'negative' : ''}`}
        >
          {getSentimentText()}
        </div>
      </div>

      {/* Keyword Chips */}
      <KeywordChips
        rating={rating}
        selectedTags={selectedTags}
        onToggleTag={handleToggleTag}
      />

      {/* Auto Review Text Editor */}
      <AutoReviewEditor
        rating={rating}
        reviewText={reviewText}
        onTextChange={setReviewText}
        onRefreshPhrasing={handleRefreshPhrasing}
      />

      {/* Policy Compliant Next Step */}
      <SmartNextStep
        rating={rating}
        reviewText={reviewText}
        selectedTags={selectedTags}
        onSubmitted={() => {
          setIsSubmitted(true);
        }}
      />
    </div>
  );
}
