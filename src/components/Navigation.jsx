import React, { useState } from 'react';
import {
  LayoutDashboard,
  Settings,
  Sparkles,
  Lock,
  LogOut,
  Building2,
  Plus,
  ChevronDown,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFeedback } from '../context/FeedbackContext';
import { SettingsModal } from './Common/SettingsModal';
import { HotelRegistryModal } from './Dashboard/HotelRegistryModal';
import { JJLogo } from './Common/JJLogo';

export function Navigation() {
  const {
    activeTab,
    setActiveTab,
    feedbacks,
    settings,
    registeredHotels,
    isManagerAuthenticated,
    lockDashboard,
  } = useFeedback();

  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [switcherFilter, setSwitcherFilter] = useState('');

  const alertThreshold = settings?.alertThreshold ?? 3;
  const unresolvedAlertCount = (feedbacks || []).filter(
    (f) => f && f.rating <= alertThreshold && !f.managerResolved
  ).length;

  const handleSelectHotel = (slug) => {
    setIsSwitcherOpen(false);
    lockDashboard();
    navigate(`/${slug}`);
  };

  const handleBrandClick = () => {
    if (settings?.hotelSlug) {
      navigate(`/${settings.hotelSlug}`);
    } else {
      navigate('/');
    }
  };

  const filteredHotels = (registeredHotels || []).filter((h) =>
    (h.name || '').toLowerCase().includes(switcherFilter.toLowerCase()) ||
    (h.hotelSlug || h.hotelId || '').toLowerCase().includes(switcherFilter.toLowerCase())
  );

  return (
    <>
      <header
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0.75rem 1.25rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* LEFT: BRAND & PROPERTY SWITCHER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div
              onClick={handleBrandClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <JJLogo size={34} rounded={9} showGlow={true} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                  JJ Review System
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--brand-rose)', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  Hospitality OS
                </span>
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--slate-200)' }} />

            {/* Property Switcher Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                className="saas-btn saas-btn-secondary"
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  gap: '0.4rem',
                  maxWidth: '220px',
                }}
              >
                <Building2 size={14} color="var(--slate-600)" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {settings?.hotelName || settings?.name || 'Select Property'}
                </span>
                <ChevronDown size={13} color="var(--slate-400)" />
              </button>

              {isSwitcherOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    left: 0,
                    background: '#FFFFFF',
                    border: '1px solid var(--slate-200)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-dropdown)',
                    minWidth: '260px',
                    maxWidth: '320px',
                    zIndex: 200,
                    padding: '0.5rem',
                  }}
                >
                  <div style={{ padding: '0.35rem 0.5rem' }}>
                    <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                      <Search
                        size={13}
                        style={{
                          position: 'absolute',
                          left: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--slate-400)',
                        }}
                      />
                      <input
                        type="text"
                        className="saas-input"
                        placeholder="Search properties..."
                        value={switcherFilter}
                        onChange={(e) => setSwitcherFilter(e.target.value)}
                        autoFocus
                        style={{ height: '32px', fontSize: '0.75rem', paddingLeft: '1.75rem' }}
                      />
                    </div>

                    <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Properties ({filteredHotels.length})
                    </div>
                  </div>

                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {filteredHotels.map((h) => {
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
                            padding: '0.45rem 0.65rem',
                            border: 'none',
                            background: isSelected ? 'var(--slate-100)' : 'transparent',
                            color: isSelected ? 'var(--slate-900)' : 'var(--slate-700)',
                            fontWeight: isSelected ? 600 : 500,
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '0.8125rem',
                          }}
                        >
                          <Building2 size={14} color={isSelected ? 'var(--slate-900)' : 'var(--slate-400)'} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>/{h.hotelSlug || h.hotelId}</div>
                          </div>
                          {isSelected && <CheckCircle2 size={13} color="var(--emerald-600)" />}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ borderTop: '1px solid var(--slate-100)', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSwitcherOpen(false);
                        setIsRegistryOpen(true);
                      }}
                      className="saas-btn saas-btn-ghost"
                      style={{ width: '100%', padding: '0.4rem 0.5rem', fontSize: '0.78125rem', color: 'var(--brand-accent)' }}
                    >
                      <Plus size={13} />
                      <span>Onboard New Property</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: PORTAL / DASHBOARD SEGMENT SWITCHER & ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div className="saas-tabs-container">
              <button
                type="button"
                className={`saas-tab-btn ${activeTab === 'guest' ? 'active' : ''}`}
                onClick={() => setActiveTab('guest')}
              >
                <Smartphone size={14} />
                <span>Guest Portal</span>
              </button>

              <button
                type="button"
                className={`saas-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                {isManagerAuthenticated ? <LayoutDashboard size={14} /> : <Lock size={13} />}
                <span>Manager Dashboard</span>
                {isManagerAuthenticated && unresolvedAlertCount > 0 && (
                  <span
                    style={{
                      background: 'var(--rose-600)',
                      color: '#FFFFFF',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.4rem',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {unresolvedAlertCount}
                  </span>
                )}
              </button>
            </div>

            {isManagerAuthenticated && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="saas-btn saas-btn-secondary"
                  style={{ padding: '0.45rem', height: '34px', width: '34px' }}
                  title="Property Settings"
                >
                  <Settings size={15} color="var(--slate-700)" />
                </button>

                <button
                  type="button"
                  onClick={lockDashboard}
                  className="saas-btn saas-btn-ghost"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', height: '34px' }}
                  title="Lock Dashboard"
                >
                  <LogOut size={13} />
                  <span>Lock</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <HotelRegistryModal
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
        onHotelOnboarded={(slug) => {
          lockDashboard();
          navigate(`/${slug}`);
        }}
      />
    </>
  );
}
