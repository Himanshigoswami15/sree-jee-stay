import React, { useState } from 'react';
import { LayoutDashboard, Settings, Sparkles, Lock, LogOut, Building2, Plus, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFeedback } from '../context/FeedbackContext';
import { SettingsModal } from './Common/SettingsModal';
import { HotelRegistryModal } from './Dashboard/HotelRegistryModal';

export function Navigation() {
  const {
    activeTab,
    setActiveTab,
    feedbacks,
    settings,
    registeredHotels,
    isManagerAuthenticated,
    lockDashboard
  } = useFeedback();

  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const alertThreshold = settings?.alertThreshold ?? 3;
  const unresolvedAlertCount = (feedbacks || []).filter(
    (f) => f && f.rating <= alertThreshold && !f.managerResolved
  ).length;

  const handleSelectHotel = (slug) => {
    setIsSwitcherOpen(false);
    lockDashboard();
    navigate(`/${slug}`);
  };

  return (
    <>
      <header className="app-header">
        {/* TOP ROW: BRAND TITLE + HOTEL SWITCHER */}
        <div className="header-top-row">
          <div className="brand-title" onClick={() => navigate('/sree-jee-stay')} style={{ cursor: 'pointer' }}>
            <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)' }}>
              <Sparkles size={18} color="#ffffff" />
            </div>
            <span className="brand-text">
              JJ Review System
            </span>
          </div>

          {/* Hotel Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                padding: '0.35rem 0.65rem',
                borderRadius: '20px',
                fontSize: '0.775rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Building2 size={13} color="#1d4ed8" />
              <span className="hotel-switcher-label">{settings?.hotelName || 'Sree Jee Stay'}</span>
              <ChevronDown size={12} color="#1d4ed8" />
            </button>

            {isSwitcherOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
                  minWidth: '240px',
                  maxWidth: '300px',
                  zIndex: 100,
                  padding: '0.5rem',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', padding: '0.35rem 0.65rem', textTransform: 'uppercase' }}>
                  Registered Hotels ({registeredHotels.length})
                </div>

                <div style={{ maxHeight: '240px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  {registeredHotels.map((h) => {
                    const isSelected = h.hotelSlug === settings.hotelSlug || h.hotelId === settings.hotelSlug;
                    return (
                      <button
                        key={h.hotelSlug || h.hotelId}
                        type="button"
                        onClick={() => handleSelectHotel(h.hotelSlug || h.hotelId)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          width: '100%',
                          padding: '0.5rem 0.65rem',
                          border: 'none',
                          background: isSelected ? '#f0fdf4' : 'transparent',
                          color: isSelected ? '#166534' : '#0f172a',
                          fontWeight: isSelected ? 800 : 600,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '0.825rem',
                          margin: '2px 0',
                        }}
                      >
                        <Building2 size={15} color={isSelected ? '#166534' : '#64748b'} style={{ flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: 800, fontSize: '0.8rem' }}>{h.name}</span>
                          <span style={{ fontSize: '0.675rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>/{h.hotelSlug || h.hotelId}</span>
                        </div>
                        {isSelected && <CheckCircle2 size={14} color="#166534" style={{ flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSwitcherOpen(false);
                      setIsRegistryOpen(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      width: '100%',
                      padding: '0.55rem 0.65rem',
                      border: 'none',
                      background: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 800,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    <Plus size={14} color="#2563eb" /> + Add New Hotel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS ROW: NAV TABS + ADD HOTEL + SETTINGS/LOCK */}
        <div className="header-actions-row">
          <nav className="nav-tabs">
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'guest' ? 'active' : ''}`}
              onClick={() => setActiveTab('guest')}
            >
              <Building2 size={15} />
              <span className="nav-tab-text-full">Guest Review Page</span>
              <span className="nav-tab-text-mobile">Review Page</span>
            </button>

            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              {isManagerAuthenticated ? <LayoutDashboard size={15} /> : <Lock size={14} color={activeTab === 'dashboard' ? '#ffffff' : '#1d4ed8'} />}
              <span className="nav-tab-text-full">Hotel Dashboard</span>
              <span className="nav-tab-text-mobile">Dashboard</span>
              {!isManagerAuthenticated && (
                <span className="protected-badge">
                  Lock
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

          {/* Master Hotel Registry Action Button */}
          <button
            type="button"
            className="btn-add-hotel-header"
            onClick={() => setIsRegistryOpen(true)}
          >
            <Plus size={14} color="#1d4ed8" /> <span className="add-hotel-text">Add Hotel</span>
          </button>

          {isManagerAuthenticated && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="icon-btn-header"
                title="Hotel Settings"
              >
                <Settings size={16} />
              </button>

              <button
                type="button"
                onClick={lockDashboard}
                className="lock-btn-header"
                title="Lock Dashboard"
              >
                <LogOut size={13} /> <span className="add-hotel-text">Lock</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <HotelRegistryModal
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
        onHotelOnboarded={(slug) => navigate(`/${slug}`)}
      />
    </>
  );
}
