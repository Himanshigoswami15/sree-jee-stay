import React, { useState } from 'react';
import { Search, CheckCircle, AlertTriangle, ExternalLink, Filter } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

export function FeedbackTable({ feedbacks }) {
  const { resolveAlert } = useFeedback();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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
              <th>Status / Contact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No feedback submissions found matching criteria.
                </td>
              </tr>
            ) : (
              filteredFeedbacks.map((fb) => {
                const isLow = fb.rating <= 3;

                return (
                  <tr key={fb.id}>
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
