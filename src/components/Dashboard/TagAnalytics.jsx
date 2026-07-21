import React from 'react';
import { RATING_KEYWORDS } from '../../utils/reviewGenerator';
import { ThumbsUp, AlertCircle, BarChart3 } from 'lucide-react';

export function TagAnalytics({ feedbacks }) {
  // Aggregate tag occurrences
  const tagCounts = {};
  feedbacks.forEach((fb) => {
    if (fb.tags && Array.isArray(fb.tags)) {
      fb.tags.forEach((tagId) => {
        tagCounts[tagId] = (tagCounts[tagId] || 0) + 1;
      });
    }
  });

  const totalSubmissions = feedbacks.length || 1;

  // Map to positive & issue tags list with frequencies
  const positiveStats = RATING_KEYWORDS.positive.map((item) => {
    const count = tagCounts[item.id] || 0;
    const percentage = Math.round((count / totalSubmissions) * 100);
    return { ...item, count, percentage };
  }).sort((a, b) => b.count - a.count);

  const negativeStats = RATING_KEYWORDS.negative.map((item) => {
    const count = tagCounts[item.id] || 0;
    const percentage = Math.round((count / totalSubmissions) * 100);
    return { ...item, count, percentage };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="analytics-two-col">
      {/* Top Positives Card */}
      <div className="chart-card">
        <div className="chart-title" style={{ color: '#34d399' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ThumbsUp size={18} /> Top Guest Highlights
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Frequency %</span>
        </div>

        <div className="tag-bar-list">
          {positiveStats.slice(0, 5).map((stat) => (
            <div key={stat.id} className="tag-bar-item">
              <div className="tag-bar-header">
                <span>{stat.label}</span>
                <span>{stat.percentage}% ({stat.count})</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill-positive"
                  style={{ width: `${Math.max(stat.percentage, 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Issues Card */}
      <div className="chart-card">
        <div className="chart-title" style={{ color: '#fb7185' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> Top Reported Issues
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Frequency %</span>
        </div>

        <div className="tag-bar-list">
          {negativeStats.slice(0, 5).map((stat) => (
            <div key={stat.id} className="tag-bar-item">
              <div className="tag-bar-header">
                <span>{stat.label}</span>
                <span>{stat.percentage}% ({stat.count})</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill-negative"
                  style={{ width: `${Math.max(stat.percentage, 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
