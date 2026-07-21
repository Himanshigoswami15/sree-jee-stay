import React, { useState } from 'react';
import { Search, Star, CheckCircle, AlertTriangle, ExternalLink, Filter } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { RATING_KEYWORDS } from '../../utils/reviewGenerator';

export function FeedbackTable({ feedbacks }) {
  const { resolveAlert } = useFeedback();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const allTagsList = [...RATING_KEYWORDS.positive, ...RATING_KEYWORDS.negative];

  const getTagLabel = (tagId) => {
    const found = allTagsList.find((t) => t.id === tagId);
    return found ? found.label : tagId;
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    // Search query match
    const matchesSearch =
      fb.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fb.guestContact && fb.guestContact.toLowerCase().includes(searchTerm.toLowerCase()));

    // Rating filter
    const matchesRating =
      ratingFilter === 'all' ? true : fb.rating === parseInt(ratingFilter, 10);

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'alerts') matchesStatus = fb.rating <= 3 && !fb.managerResolved;
    if (statusFilter === 'resolved') matchesStatus = fb.managerResolved;
    if (statusFilter === 'public') matchesStatus = fb.postedPublic || fb.status === 'Public Posted';

    return matchesSearch && matchesRating && matchesStatus;
  });

  return (
    <div className="feed-card">
      <div className="table-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="search-input"
            placeholder="Search room, text, or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={14} color="var(--text-muted)" />
            <select
              className="filter-select"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
              <option value="4">4 Stars ⭐⭐⭐⭐</option>
              <option value="3">3 Stars ⭐⭐⭐</option>
              <option value="2">2 Stars ⭐⭐</option>
              <option value="1">1 Star ⭐</option>
            </select>
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="alerts">🚨 Unresolved Alerts (≤3 Stars)</option>
            <option value="resolved">✅ Manager Resolved</option>
            <option value="public">🌐 Posted on Google</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Room / Location</th>
              <th>Rating</th>
              <th>Tags & Feedback Text</th>
              <th>Status / Contact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No feedback submissions found matching criteria.
                </td>
              </tr>
            ) : (
              filteredFeedbacks.map((fb) => {
                const isLow = fb.rating <= 3;
                const dateStr = new Date(fb.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <tr key={fb.id}>
                    <td>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {fb.roomNumber}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dateStr}</div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontWeight: 700 }}>
                        <Star size={16} fill="#fbbf24" />
                        <span>{fb.rating}.0</span>
                      </div>
                    </td>

                    <td>
                      {/* Tags */}
                      {fb.tags && fb.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                          {fb.tags.map((tId) => (
                            <span
                              key={tId}
                              style={{
                                fontSize: '0.7rem',
                                background: isLow ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: isLow ? '#fca5a5' : '#6ee7b7',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '12px',
                                border: `1px solid ${isLow ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                              }}
                            >
                              {getTagLabel(tId)}
                            </span>
                          ))}
                        </div>
                      )}
                      <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                        "{fb.reviewText}"
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {fb.managerResolved ? (
                          <span className="badge-status status-resolved">
                            <CheckCircle size={12} /> Resolved
                          </span>
                        ) : isLow ? (
                          <span className="badge-status status-alert">
                            <AlertTriangle size={12} /> Manager Alerted
                          </span>
                        ) : (
                          <span className="badge-status status-public">
                            <ExternalLink size={12} /> {fb.postedPublic ? 'Posted on Google' : 'Submitted'}
                          </span>
                        )}

                        {fb.guestContact && (
                          <span style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 600 }}>
                            📞 {fb.guestContact}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      {isLow && !fb.managerResolved && (
                        <button
                          type="button"
                          onClick={() => resolveAlert(fb.id)}
                          className="btn-toast-action"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          Resolve Alert
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
