import React, { useState } from 'react';
import { Search, CheckCircle, AlertTriangle, ExternalLink, Filter } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

export function FeedbackTable({ feedbacks = [] }) {
  const { resolveAlert } = useFeedback();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];

  const filteredFeedbacks = safeFeedbacks.filter((fb) => {
    if (!fb) return false;

    // Search query match with safe null guards
    const query = (searchTerm || '').toLowerCase();
    const reviewText = (fb.reviewText || '').toLowerCase();
    const guestContact = (fb.guestContact || '').toLowerCase();
    const roomNumber = (fb.roomNumber || '').toLowerCase();

    const matchesSearch =
      !query ||
      reviewText.includes(query) ||
      guestContact.includes(query) ||
      roomNumber.includes(query);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
          <Filter size={18} color="#2563eb" />
          <span>Guest Submissions & Feedback Trail</span>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.1rem', fontSize: '0.825rem', width: '200px' }}
              placeholder="Search text or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-input"
            style={{ width: '130px', fontSize: '0.825rem', fontWeight: 700 }}
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

          <select
            className="form-input"
            style={{ width: '140px', fontSize: '0.825rem', fontWeight: 700 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="alerts">🚨 Manager Alerts</option>
            <option value="resolved">✅ Resolved</option>
            <option value="public">🌐 Public Posted</option>
          </select>
        </div>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          No guest feedback entries found matching current filter criteria.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Rating</th>
                <th>Guest Feedback</th>
                <th>Contact</th>
                <th>Date / Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((fb) => (
                <tr key={fb.id || fb._id}>
                  <td style={{ fontWeight: 800, color: fb.rating >= 4 ? '#16a34a' : fb.rating === 3 ? '#d97706' : '#dc2626' }}>
                    {fb.rating} ⭐
                  </td>
                  <td style={{ maxWidth: '340px' }}>
                    <div style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>
                      "{fb.reviewText || 'No text left'}"
                    </div>
                  </td>
                  <td style={{ fontSize: '0.825rem', fontWeight: 700, color: '#2563eb' }}>
                    {fb.guestContact || 'Anonymous'}
                  </td>
                  <td style={{ fontSize: '0.775rem', color: '#64748b' }}>
                    {fb.timestamp ? new Date(fb.timestamp).toLocaleString() : 'N/A'}
                  </td>
                  <td>
                    {fb.managerResolved ? (
                      <span className="badge-status status-resolved">✅ Resolved</span>
                    ) : fb.rating <= 3 ? (
                      <span className="badge-status status-alert">🚨 Alerted Manager</span>
                    ) : fb.postedPublic ? (
                      <span className="badge-status status-public">🌐 Public Posted</span>
                    ) : (
                      <span className="badge-status">Submitted</span>
                    )}
                  </td>
                  <td>
                    {fb.rating <= 3 && !fb.managerResolved && (
                      <button
                        type="button"
                        className="btn-toast-action"
                        onClick={() => resolveAlert(fb.id || fb._id)}
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
