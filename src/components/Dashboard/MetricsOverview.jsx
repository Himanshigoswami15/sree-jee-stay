import React, { useState, useEffect } from 'react';
import { Star, AlertTriangle, Smartphone, BarChart3 } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { apiClient } from '../../services/apiClient';

export function MetricsOverview({ feedbacks, alertThreshold }) {
  const { settings } = useFeedback();
  const [scanAnalytics, setScanAnalytics] = useState({
    totalScans: 0,
    todayScans: 0,
    conversionRate: 0,
    topScanTime: '7 PM',
  });

  const hotelSlug = settings.hotelSlug || 'sree-jee-stay';

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await apiClient(`/api/review/analytics?hotelSlug=${encodeURIComponent(hotelSlug)}`);
        if (res.success && res.analytics) {
          setScanAnalytics(res.analytics);
        }
      } catch (e) {}
    }
    fetchAnalytics();
  }, [hotelSlug]);

  const totalReviews = feedbacks.length;
  
  const avgRating = totalReviews > 0
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const unresolvedAlerts = feedbacks.filter(
    (f) => f.rating <= alertThreshold && !f.managerResolved
  ).length;

  return (
    <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
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
          {unresolvedAlerts > 0 ? 'Requires duty manager attention' : 'All low-rating alerts handled'}
        </div>
      </div>

      {/* QR Scans & Today's Activity */}
      <div className="metric-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
        <div className="metric-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#475569', fontWeight: 800 }}>Total QR Scans</span>
          <Smartphone size={18} color="#2563eb" />
        </div>
        <div className="metric-value" style={{ color: '#0f172a', fontWeight: 800 }}>
          {scanAnalytics.totalScans || 0}
        </div>
        <div className="metric-footer" style={{ color: '#059669', fontWeight: 700 }}>
          Today's Scans: {scanAnalytics.todayScans || 0}
        </div>
      </div>

      {/* Review Conversion % */}
      <div className="metric-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
        <div className="metric-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#475569', fontWeight: 800 }}>Scan Conversion</span>
          <BarChart3 size={18} color="#4f46e5" />
        </div>
        <div className="metric-value" style={{ color: '#4f46e5', fontWeight: 800 }}>
          {scanAnalytics.conversionRate || 0}%
        </div>
        <div className="metric-footer" style={{ color: '#64748b', fontWeight: 600 }}>
          Peak Scan Window: {scanAnalytics.topScanTime || '7 PM'}
        </div>
      </div>
    </div>
  );
}
