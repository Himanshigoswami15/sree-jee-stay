import React, { useState } from 'react';
import { Search, Filter, Star, CheckCircle2, AlertCircle, Globe, X, Clock, Smartphone, MessageSquare, Tag } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

export function FeedbackTable({ feedbacks = [] }) {
  const { resolveAlert } = useFeedback();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];

  const filteredFeedbacks = safeFeedbacks.filter((fb) => {
    if (!fb) return false;

    const query = (searchTerm || '').toLowerCase();
    const reviewText = (fb.reviewText || '').toLowerCase();
    const guestContact = (fb.guestContact || '').toLowerCase();
    const roomNumber = (fb.roomNumber || '').toLowerCase();

    const matchesSearch =
      !query ||
      reviewText.includes(query) ||
      guestContact.includes(query) ||
      roomNumber.includes(query);

    const matchesRating =
      ratingFilter === 'all' ? true : fb.rating === parseInt(ratingFilter, 10);

    let matchesStatus = true;
    if (statusFilter === 'alerts') matchesStatus = fb.rating <= 3 && !fb.managerResolved;
    if (statusFilter === 'resolved') matchesStatus = fb.managerResolved;
    if (statusFilter === 'public') matchesStatus = fb.postedPublic || fb.status === 'Public Posted';

    return matchesSearch && matchesRating && matchesStatus;
  });

  return (
    <div className="saas-card" style={{ overflow: 'hidden' }}>
      {/* Header with Search & Filters */}
      <div className="saas-card-header" style={{ flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
            Guest Feedback Stream
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Showing {filteredFeedbacks.length} of {safeFeedbacks.length} guest records
          </span>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--slate-400)',
              }}
            />
            <input
              type="text"
              className="saas-input"
              style={{ paddingLeft: '2rem', height: '36px', fontSize: '0.8125rem', width: '190px' }}
              placeholder="Search text, phone, room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="saas-input"
            style={{ width: '120px', height: '36px', fontSize: '0.8125rem', fontWeight: 600, padding: '0 0.5rem' }}
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            className="saas-input"
            style={{ width: '135px', height: '36px', fontSize: '0.8125rem', fontWeight: 600, padding: '0 0.5rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="alerts">Duty Alerts</option>
            <option value="resolved">Resolved</option>
            <option value="public">Public Posted</option>
          </select>
        </div>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.875rem' }}>
          No guest feedback entries match the selected filter criteria.
        </div>
      ) : (
        <div className="saas-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="saas-table">
            <thead>
              <tr>
                <th>Rating</th>
                <th>Guest Feedback</th>
                <th>Contact / Room</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((fb) => {
                const id = fb.id || fb._id;
                const isAlert = fb.rating <= 3 && !fb.managerResolved;

                return (
                  <tr
                    key={id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedFeedback(fb)}
                  >
                    <td>
                      <div
                        className={`saas-badge ${
                          fb.rating >= 4
                            ? 'saas-badge-gold'
                            : fb.rating === 3
                            ? 'saas-badge-warning'
                            : 'saas-badge-danger'
                        }`}
                      >
                        <Star size={12} fill="currentColor" />
                        <span>{fb.rating}.0</span>
                      </div>
                    </td>

                    <td style={{ maxWidth: '360px' }}>
                      <div
                        style={{
                          fontWeight: 500,
                          color: 'var(--slate-900)',
                          fontSize: '0.8125rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fb.reviewText ? `"${fb.reviewText}"` : <span style={{ color: 'var(--slate-400)' }}>Rating only</span>}
                      </div>

                      {Array.isArray(fb.tags) && fb.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                          {fb.tags.slice(0, 3).map((t, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.6875rem',
                                color: 'var(--slate-500)',
                                background: 'var(--slate-100)',
                                padding: '0.1rem 0.4rem',
                                borderRadius: 'var(--radius-xs)',
                              }}
                            >
                              {t}
                            </span>
                          ))}
                          {fb.tags.length > 3 && (
                            <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>
                              +{fb.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                        {fb.guestContact || 'Guest'}
                      </div>
                      {fb.roomNumber && (
                        <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>
                          Room {fb.roomNumber}
                        </div>
                      )}
                    </td>

                    <td style={{ fontSize: '0.75rem', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>
                      {fb.timestamp ? new Date(fb.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </td>

                    <td>
                      {fb.managerResolved ? (
                        <span className="saas-badge saas-badge-success">
                          <CheckCircle2 size={11} /> Resolved
                        </span>
                      ) : isAlert ? (
                        <span className="saas-badge saas-badge-danger">
                          <AlertCircle size={11} /> Duty Alert
                        </span>
                      ) : fb.postedPublic ? (
                        <span className="saas-badge saas-badge-accent">
                          <Globe size={11} /> Public Posted
                        </span>
                      ) : (
                        <span className="saas-badge saas-badge-neutral">
                          Submitted
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      {isAlert ? (
                        <button
                          type="button"
                          className="saas-btn saas-btn-secondary"
                          style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', height: '28px' }}
                          onClick={() => resolveAlert(id)}
                        >
                          Resolve
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="saas-btn saas-btn-ghost"
                          style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', height: '28px' }}
                          onClick={() => setSelectedFeedback(fb)}
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Detail Modal */}
      {selectedFeedback && (
        <div className="saas-modal-overlay" onClick={() => setSelectedFeedback(null)}>
          <div className="saas-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="saas-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  className={`saas-badge ${
                    selectedFeedback.rating >= 4
                      ? 'saas-badge-gold'
                      : selectedFeedback.rating === 3
                      ? 'saas-badge-warning'
                      : 'saas-badge-danger'
                  }`}
                >
                  <Star size={12} fill="currentColor" />
                  <span>{selectedFeedback.rating}.0 Rating</span>
                </div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                  {selectedFeedback.timestamp ? new Date(selectedFeedback.timestamp).toLocaleString() : ''}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="saas-btn saas-btn-ghost"
                style={{ padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="saas-card-body">
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Full Review Text
                </div>
                <div
                  style={{
                    background: 'var(--slate-50)',
                    border: '1px solid var(--slate-200)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9375rem',
                    lineHeight: '1.6',
                    color: 'var(--slate-900)',
                  }}
                >
                  {selectedFeedback.reviewText || 'No written comments left by guest.'}
                </div>
              </div>

              {Array.isArray(selectedFeedback.tags) && selectedFeedback.tags.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Selected Highlights
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {selectedFeedback.tags.map((t, idx) => (
                      <span key={idx} className="saas-badge saas-badge-neutral">
                        <Tag size={11} /> {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Guest Contact / ID
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '0.2rem' }}>
                    {selectedFeedback.guestContact || 'Anonymous'}
                  </div>
                </div>

                <div style={{ background: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Room / Table
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '0.2rem' }}>
                    {selectedFeedback.roomNumber ? `Room ${selectedFeedback.roomNumber}` : 'Not specified'}
                  </div>
                </div>
              </div>
            </div>

            <div className="saas-card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              {selectedFeedback.rating <= 3 && !selectedFeedback.managerResolved && (
                <button
                  type="button"
                  className="saas-btn saas-btn-primary"
                  onClick={() => {
                    resolveAlert(selectedFeedback.id || selectedFeedback._id);
                    setSelectedFeedback(null);
                  }}
                >
                  <CheckCircle2 size={15} />
                  <span>Mark as Resolved</span>
                </button>
              )}

              <button
                type="button"
                className="saas-btn saas-btn-secondary"
                onClick={() => setSelectedFeedback(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
