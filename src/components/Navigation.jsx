import React, { useState } from 'react';
import { Smartphone, LayoutDashboard, Settings, Sparkles, Lock, LogOut } from 'lucide-react';
import { useFeedback } from '../context/FeedbackContext';
import { SettingsModal } from './Common/SettingsModal';

export function Navigation() {
  const {
    activeTab,
    setActiveTab,
    feedbacks,
    settings,
    currentRoom,
    setCurrentRoom,
    isManagerAuthenticated,
    lockDashboard
  } = useFeedback();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const unresolvedAlertCount = feedbacks.filter(
    (f) => f.rating <= settings.alertThreshold && !f.managerResolved
  ).length;

  return (
    <>
      <header className="app-header">
        <div className="brand-title">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <span>ReviewPulse</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Room quick switcher when in guest view */}
          {activeTab === 'guest' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.35rem 0.75rem', borderRadius: '10px', border: '1px solid var(--bg-card-border)', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Simulating Room:</span>
              <select
                value={currentRoom}
                onChange={(e) => setCurrentRoom(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#a5b4fc', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}
              >
                <option value="Room 204" style={{ background: '#0f172a' }}>Room 204</option>
                <option value="Room 312" style={{ background: '#0f172a' }}>Room 312</option>
                <option value="Room 108" style={{ background: '#0f172a' }}>Room 108</option>
                <option value="Table 14" style={{ background: '#0f172a' }}>Table 14</option>
                <option value="Room 501" style={{ background: '#0f172a' }}>Room 501</option>
              </select>
            </div>
          )}

          {/* Navigation View Switcher */}
          <nav className="nav-tabs">
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'guest' ? 'active' : ''}`}
              onClick={() => setActiveTab('guest')}
            >
              <Smartphone size={16} />
              <span>Guest Review Page</span>
            </button>

            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              {isManagerAuthenticated ? <LayoutDashboard size={16} /> : <Lock size={15} color="#fb7185" />}
              <span>Manager Dashboard</span>
              {!isManagerAuthenticated && (
                <span style={{ fontSize: '0.7rem', color: '#fb7185', background: 'rgba(239, 68, 68, 0.2)', padding: '0.1rem 0.45rem', borderRadius: '8px', fontWeight: 700 }}>
                  PIN Protected
                </span>
              )}
              {isManagerAuthenticated && unresolvedAlertCount > 0 && (
                <span
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '10px',
                  }}
                >
                  {unresolvedAlertCount}
                </span>
              )}
            </button>
          </nav>

          {isManagerAuthenticated && (
            <>
              <button
                type="button"
                className="nav-tab-btn"
                onClick={() => setIsSettingsOpen(true)}
                style={{ padding: '0.5rem' }}
                title="Settings"
              >
                <Settings size={18} />
              </button>

              <button
                type="button"
                className="btn-toast-action"
                onClick={lockDashboard}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                title="Lock Manager Dashboard"
              >
                <LogOut size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Lock Manager
              </button>
            </>
          )}
        </div>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
