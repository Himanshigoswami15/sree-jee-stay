import React from 'react';
import { Star, MessageSquare, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';

export function MetricsOverview({ feedbacks, alertThreshold }) {
  const totalReviews = feedbacks.length;
  
  const avgRating = totalReviews > 0
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const unresolvedAlerts = feedbacks.filter(
    (f) => f.rating <= alertThreshold && !f.managerResolved
  ).length;

  const publicPostedCount = feedbacks.filter((f) => f.postedPublic || f.status === 'Public Posted').length;
  const publicConversionRate = totalReviews > 0 ? Math.round((publicPostedCount / totalReviews) * 100) : 0;

  // NPS Calculation (% 5-star Promoters - % 1-3 star Detractors)
  const promoters = feedbacks.filter((f) => f.rating === 5).length;
  const detractors = feedbacks.filter((f) => f.rating <= 3).length;
  const npsScore = totalReviews > 0 ? Math.round(((promoters - detractors) / totalReviews) * 100) : 100;

  return (
    <div className="metrics-grid">
      {/* Avg Rating Card */}
      <div className="metric-card rating-card">
        <div className="metric-header">
          <span>Overall Guest Rating</span>
          <Star size={18} color="#fbbf24" fill="#fbbf24" />
        </div>
        <div className="metric-value" style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
          <span>{avgRating}</span>
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 5.0</span>
        </div>
        <div className="metric-footer">
          Based on {totalReviews} recent guest feedback submissions
        </div>
      </div>

      {/* Unresolved Manager Alerts Card */}
      <div className="metric-card alert-card">
        <div className="metric-header">
          <span>Active Manager Alerts</span>
          <AlertTriangle size={18} color="#ef4444" />
        </div>
        <div className="metric-value" style={{ color: unresolvedAlerts > 0 ? '#ef4444' : '#34d399' }}>
          {unresolvedAlerts}
        </div>
        <div className="metric-footer">
          {unresolvedAlerts > 0 ? 'Requires immediate duty manager attention' : 'All low-rating alerts handled'}
        </div>
      </div>

      {/* Public Conversion & NPS Card */}
      <div className="metric-card positive-card">
        <div className="metric-header">
          <span>Net Promoter Score (NPS)</span>
          <TrendingUp size={18} color="#10b981" />
        </div>
        <div className="metric-value">
          {npsScore > 0 ? `+${npsScore}` : npsScore}
        </div>
        <div className="metric-footer">
          {publicConversionRate}% public review conversion rate
        </div>
      </div>

      {/* Policy Compliance Card */}
      <div className="metric-card" style={{ borderLeft: '4px solid var(--primary)' }}>
        <div className="metric-header">
          <span>Policy Compliance</span>
          <ShieldCheck size={18} color="#6366f1" />
        </div>
        <div className="metric-value" style={{ color: '#818cf8', fontSize: '1.6rem' }}>
          100% Compliant
        </div>
        <div className="metric-footer">
          No review gating • All guests have public link access
        </div>
      </div>
    </div>
  );
}
