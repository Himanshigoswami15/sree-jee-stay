import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

export function AlertBanner() {
  const { managerAlertToast, dismissAlertToast, resolveAlert, setActiveTab } = useFeedback();

  if (!managerAlertToast) return null;

  const handleResolve = () => {
    resolveAlert(managerAlertToast.id);
    dismissAlertToast();
  };

  const handleViewDashboard = () => {
    setActiveTab('dashboard');
    dismissAlertToast();
  };

  return (
    <div className="alert-toast-container">
      <div className="alert-toast-card">
        <div className="alert-toast-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={18} /> DUTY MANAGER ALERT
          </span>
          <button
            type="button"
            onClick={dismissAlertToast}
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="alert-toast-body">
          {managerAlertToast.message}
        </div>

        <div className="alert-toast-actions">
          <button
            type="button"
            className="btn-toast-action"
            onClick={handleResolve}
          >
            <CheckCircle2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
            Mark Issue Resolved
          </button>

          <button
            type="button"
            className="btn-toast-close"
            onClick={handleViewDashboard}
          >
            Open Dashboard Feed
          </button>
        </div>
      </div>
    </div>
  );
}
