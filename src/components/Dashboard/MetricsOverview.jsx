import React from 'react';
import { Star, AlertTriangle } from 'lucide-react';

export function MetricsOverview({ feedbacks, alertThreshold }) {
  const totalReviews = feedbacks.length;
  
  const avgRating = totalReviews > 0
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const unresolvedAlerts = feedbacks.filter(
    (f) => f.rating <= alertThreshold && !f.managerResolved
  ).length;

  return (
    <div className="metrics-grid">
      {/* Avg Rating Card */}
      <div className="metric-card rating-card">
        <div className="metric-header">
          <span style={{ color: '#475569', fontWeight: 800 }}>Overall Guest Rating</span>
          <Star size={18} color="#f59e0b" fill="#f59e0b" />
        </div>
        <div className="metric-value" style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', color: '#0f172a' }}>
          <span>{avgRating}</span>
          <span style={{ fontSize: '1rem', color: '#475569', fontWeight: 700 }}>/ 5.0</span>
        </div>
        <div className="metric-footer" style={{ color: '#64748b', fontWeight: 600 }}>
          Based on {totalReviews} recent guest feedback submissions
        </div>
      </div>

      {/* Unresolved Manager Alerts Card */}
      <div className="metric-card alert-card">
        <div className="metric-header">
          <span style={{ color: '#475569', fontWeight: 800 }}>Active Manager Alerts</span>
          <AlertTriangle size={18} color="#dc2626" />
        </div>
        <div className="metric-value" style={{ color: unresolvedAlerts > 0 ? '#dc2626' : '#059669', fontWeight: 800 }}>
          {unresolvedAlerts}
        </div>
        <div className="metric-footer" style={{ color: unresolvedAlerts > 0 ? '#dc2626' : '#059669', fontWeight: 700 }}>
          {unresolvedAlerts > 0 ? 'Requires immediate duty manager attention' : 'All low-rating alerts handled'}
        </div>
      </div>
    </div>
  );
}
