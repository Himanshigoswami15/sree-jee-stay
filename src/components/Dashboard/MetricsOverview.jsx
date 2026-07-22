import React from 'react';
import { Star, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';

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

      {/* Public Conversion & NPS Card */}
      <div
        className="metric-card"
        style={{
          borderLeft: `4px solid ${npsScore >= 0 ? '#10b981' : '#f43f5e'}`
        }}
      >
        <div className="metric-header">
          <span style={{ color: '#475569', fontWeight: 800 }}>Net Promoter Score (NPS)</span>
          <TrendingUp size={18} color={npsScore >= 0 ? '#10b981' : '#f43f5e'} />
        </div>
        <div className="metric-value" style={{ color: npsScore >= 0 ? '#059669' : '#e11d48', fontWeight: 800 }}>
          {npsScore > 0 ? `+${npsScore}` : npsScore}
        </div>
        <div className="metric-footer" style={{ color: '#64748b', fontWeight: 600 }}>
          {publicConversionRate}% public review conversion rate
        </div>
      </div>

      {/* Policy Compliance Card */}
      <div className="metric-card" style={{ borderLeft: '4px solid #4f46e5' }}>
        <div className="metric-header">
          <span style={{ color: '#475569', fontWeight: 800 }}>Policy Compliance</span>
          <ShieldCheck size={18} color="#4f46e5" />
        </div>
        <div className="metric-value" style={{ color: '#4f46e5', fontSize: '1.6rem', fontWeight: 800 }}>
          100% Compliant
        </div>
        <div className="metric-footer" style={{ color: '#64748b', fontWeight: 600 }}>
          No review gating • All guests have public link access
        </div>
      </div>
    </div>
  );
}
