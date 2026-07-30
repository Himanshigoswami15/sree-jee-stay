import React, { useState } from 'react';
import { Star, CheckCircle, ExternalLink, MessageSquare, Copy, Check, HeartHandshake } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { generateReviewText } from '../../utils/reviewGenerator';

export function GuestReviewCard() {
  const { settings, keywords, addFeedback } = useFeedback();

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customNote, setCustomNote] = useState('');
  const [guestContact, setGuestContact] = useState('');

  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const primaryColor = settings.themeColor || '#2563eb';
  const isHighRating = rating >= 4;

  const availableTags = isHighRating
    ? (keywords.positive || [])
    : (keywords.negative || []);

  const generatedReview = generateReviewText({
    rating,
    selectedTags,
    customNote,
    hotelName: settings.hotelName,
    tone: settings.tone || 'friendly',
    reviewLength: settings.reviewLength || 'short',
    includeEmojis: settings.includeEmojis !== false,
    mentionStaff: settings.mentionStaff !== false,
    mentionCleanliness: settings.mentionCleanliness !== false,
    mentionFood: settings.mentionFood !== false,
    mentionLocation: settings.mentionLocation !== false,
    keywordsList: keywords,
  });

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleCopy = () => {
    if (!generatedReview) return;
    navigator.clipboard.writeText(generatedReview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    await addFeedback({
      rating,
      tags: selectedTags,
      reviewText: generatedReview,
      guestContact,
      postedPublic: isHighRating,
    });

    setSubmitted(true);

    if (isHighRating && settings.googleReviewUrl) {
      window.open(settings.googleReviewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '1.5rem auto', background: '#ffffff', borderRadius: '24px', padding: '2rem 1.5rem', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)', border: '1px solid #f1f5f9', textAlign: 'center' }}>
      {/* BRANDING HEADER */}
      {settings.logoUrl ? (
        <img
          src={settings.logoUrl}
          alt="Business Logo"
          style={{ width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 0.75rem', objectFit: 'cover', border: '3px solid #f1f5f9' }}
        />
      ) : (
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: primaryColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, margin: '0 auto 0.75rem', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
          {(settings.hotelName || 'B')[0]}
        </div>
      )}

      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
        {settings.hotelName || 'Sree Jee Stay'}
      </h2>

      <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, margin: '0 0 1.5rem' }}>
        Loved your experience? We'd appreciate your feedback!
      </p>

      {/* 5-STAR RATING SELECTOR */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              setRating(star);
              setSelectedTags([]);
            }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.2rem', transition: 'transform 0.15s ease' }}
          >
            <Star
              size={36}
              color={star <= rating ? '#f59e0b' : '#cbd5e1'}
              fill={star <= rating ? '#f59e0b' : 'none'}
            />
          </button>
        ))}
      </div>

      {/* SMART REVIEW FLOW */}
      {submitted ? (
        <div style={{ padding: '1.5rem', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
          <CheckCircle size={36} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065f46', margin: '0 0 0.25rem' }}>
            Thank You for Your Feedback!
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#047857', margin: 0 }}>
            {isHighRating
              ? 'Your review was submitted and redirected to Google. We appreciate your support!'
              : 'Your private feedback has been received. Our manager will look into your comments promptly.'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tag Selection Chips */}
          {availableTags.length > 0 && (
            <div>
              <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#475569', marginBottom: '0.65rem' }}>
                {isHighRating ? 'What did you enjoy most?' : 'What could we improve?'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    style={{
                      fontSize: '0.775rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '20px',
                      border: selectedTags.includes(tag.id) ? `1.5px solid ${primaryColor}` : '1px solid #cbd5e1',
                      background: selectedTags.includes(tag.id) ? '#eff6ff' : '#f8fafc',
                      color: selectedTags.includes(tag.id) ? primaryColor : '#334155',
                      fontWeight: selectedTags.includes(tag.id) ? 800 : 600,
                      cursor: 'pointer',
                    }}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Auto-Generated Review Box */}
          {isHighRating && (
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '1.15rem', textAlign: 'left', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={16} color={primaryColor} /> Auto-Written Review Text:
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    background: copied ? '#ecfdf5' : '#eeeffe',
                    border: copied ? '1px solid #a7f3d0' : '1px solid #c7d2fe',
                    color: copied ? '#059669' : primaryColor,
                    cursor: 'pointer',
                    fontSize: '0.775rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '20px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Text'}
                </button>
              </div>

              <textarea
                className="review-textarea"
                value={generatedReview}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Your review text will appear here automatically..."
                style={{
                  width: '100%',
                  minHeight: '115px',
                  fontSize: '0.925rem',
                  lineHeight: '1.5',
                  fontWeight: '600',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  boxSizing: 'border-box',
                  color: '#0f172a',
                  background: '#f8fafc',
                  resize: 'vertical',
                }}
              />
            </div>
          )}

          {/* Phone / Contact Input for low ratings or private feedback */}
          {!isHighRating && (
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label" style={{ fontWeight: 800 }}>Phone / Contact (Optional):</label>
              <input
                type="text"
                className="form-input"
                value={guestContact}
                onChange={(e) => setGuestContact(e.target.value)}
                placeholder="e.g. +91 98765 43210 for manager response"
              />
            </div>
          )}

          {/* ACTION BUTTON */}
          <button
            type="submit"
            className="btn-primary-action"
            style={{ padding: '0.85rem 1.5rem', borderRadius: '14px', fontSize: '0.95rem', background: primaryColor, justifyContent: 'center' }}
          >
            {isHighRating ? (
              <>
                <Star size={18} fill="white" /> Post Google Review Now
              </>
            ) : (
              <>
                <HeartHandshake size={18} /> Submit Private Feedback to Manager
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
