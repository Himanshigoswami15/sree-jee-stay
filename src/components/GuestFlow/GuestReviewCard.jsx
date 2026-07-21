import React, { useState, useEffect } from 'react';
import { Star, Building2, MapPin } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { generateReviewText } from '../../utils/reviewGenerator';
import { KeywordChips } from './KeywordChips';
import { AutoReviewEditor } from './AutoReviewEditor';
import { SmartNextStep } from './SmartNextStep';
import { ThankYouCard } from './ThankYouCard';

export function GuestReviewCard() {
  const { settings, currentRoom, keywords } = useFeedback();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update auto-written review when rating or selected tags change
  useEffect(() => {
    if (rating > 0) {
      const generated = generateReviewText({
        rating,
        roomNumber: currentRoom,
        selectedTags,
        keywordsList: keywords,
      });
      setReviewText(generated);
    } else {
      setReviewText('');
    }
  }, [rating, selectedTags, currentRoom, keywords]);

  const handleStarClick = (val) => {
    setRating(val);
    setSelectedTags([]); // Reset tags when changing sentiment
  };

  const handleToggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleResetForm = () => {
    setRating(0);
    setSelectedTags([]);
    setReviewText('');
    setIsSubmitted(false);
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
        roomNumber={currentRoom}
        onReset={handleResetForm}
      />
    );
  }

  return (
    <div className="guest-card">
      {/* Header */}
      <div className="hotel-badge-header">
        <div className="hotel-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <Building2 size={13} /> {settings.hotelName}
          </div>
          <div className="hotel-name">Guest Feedback</div>
        </div>
        <div className="room-tag">
          <MapPin size={12} /> {currentRoom}
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
      />

      {/* Policy Compliant Next Step */}
      <SmartNextStep
        rating={rating}
        reviewText={reviewText}
        selectedTags={selectedTags}
        roomNumber={currentRoom}
        onSubmitted={() => {
          setIsSubmitted(true);
        }}
      />
    </div>
  );
}
