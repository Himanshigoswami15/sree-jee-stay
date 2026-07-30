import React, { useState } from 'react';
import { LayoutDashboard, Settings, Sparkles, Lock, LogOut, Building2, Plus, ChevronDown } from 'lucide-react';
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
    navigate(`/${slug}`);
  };

  return (
    <>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="brand-title" onClick={() => navigate('/sree-jee-stay')} style={{ cursor: 'pointer' }}>
            <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)' }}>
              <Sparkles size={20} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
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
                gap: '0.4rem',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Building2 size={14} color="#1d4ed8" />
              <span>{settings.hotelName || 'Sree Jee Stay'}</span>
              <ChevronDown size={13} color="#1d4ed8" />
            </button>

            {isSwitcherOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  left: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
                  minWidth: '240px',
                  zIndex: 100,
                  padding: '0.5rem',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', padding: '0.35rem 0.65rem', textTransform: 'uppercase' }}>
                  Registered Hotels
                </div>

                {registeredHotels.map((h) => (
                  <button
                    key={h.hotelSlug}
                    type="button"
                    onClick={() => handleSelectHotel(h.hotelSlug)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.55rem 0.65rem',
                      border: 'none',
                      background: h.hotelSlug === settings.hotelSlug ? '#f0fdf4' : 'transparent',
                      color: h.hotelSlug === settings.hotelSlug ? '#166534' : '#0f172a',
                      fontWeight: h.hotelSlug === settings.hotelSlug ? 800 : 600,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.825rem',
                    }}
                  >
                    <Building2 size={14} color={h.hotelSlug === settings.hotelSlug ? '#166534' : '#64748b'} />
                    <span style={{ flex: 1 }}>{h.name}</span>
                  </button>
                ))}

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <nav className="nav-tabs">
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'guest' ? 'active' : ''}`}
              onClick={() => setActiveTab('guest')}
            >
              <Building2 size={16} />
              <span>Guest Review Page</span>
            </button>

            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              {isManagerAuthenticated ? <LayoutDashboard size={16} /> : <Lock size={15} color={activeTab === 'dashboard' ? '#ffffff' : '#1d4ed8'} />}
              <span>Hotel Dashboard</span>
              {!isManagerAuthenticated && (
                <span style={{ fontSize: '0.7rem', color: activeTab === 'dashboard' ? '#ffffff' : '#1d4ed8', background: activeTab === 'dashboard' ? 'rgba(255, 255, 255, 0.25)' : '#e0f2fe', padding: '0.1rem 0.45rem', borderRadius: '8px', fontWeight: 800 }}>
                  Protected
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
            onClick={() => setIsRegistryOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              padding: '0.4rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              height: '38px',
            }}
          >
            <Plus size={14} color="#1d4ed8" /> Add Hotel
          </button>

          {isManagerAuthenticated && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  color: '#475569',
                  cursor: 'pointer',
                }}
                title="Hotel Settings"
              >
                <Settings size={18} />
              </button>

              <button
                type="button"
                onClick={lockDashboard}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fca5a5',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  height: '38px',
                }}
                title="Lock Dashboard"
              >
                <LogOut size={14} /> Lock
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
