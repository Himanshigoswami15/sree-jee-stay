import React, { Component, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { Building2, Plus, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { FeedbackProvider, useFeedback } from './context/FeedbackContext';
import { Navigation } from './components/Navigation';
import { AlertBanner } from './components/Common/AlertBanner';
import { ManagerPinModal } from './components/Common/ManagerPinModal';
import { GuestReviewCard } from './components/GuestFlow/GuestReviewCard';
import { TabbedDashboard } from './components/Dashboard/TabbedDashboard';
import { HotelRegistryModal } from './components/Dashboard/HotelRegistryModal';
import { SuperAdminPortal } from './components/Dashboard/SuperAdminPortal';
import { JJLogo } from './components/Common/JJLogo';
import { apiClient } from './services/apiClient';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: '520px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }} className="saas-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
            Application Notice
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
            An unexpected error occurred while rendering this interface.
          </p>
          <div
            style={{
              background: 'var(--slate-50)',
              border: '1px solid var(--slate-200)',
              color: 'var(--rose-600)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              textAlign: 'left',
              fontFamily: 'monospace',
              overflowX: 'auto',
              marginBottom: '1.25rem',
              whiteSpace: 'pre-wrap',
              maxHeight: '160px',
            }}
          >
            {this.state.error ? String(this.state.error.message || this.state.error) : 'Unknown Error'}
          </div>
          <button
            type="button"
            className="saas-btn saas-btn-primary"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            <RefreshCw size={14} />
            <span>Reload Page</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainContent() {
  const { activeTab, loading, hotelNotFound } = useFeedback();
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--slate-500)', fontSize: '0.9375rem', fontWeight: 500 }}>
        Loading property portal...
      </div>
    );
  }

  if (hotelNotFound) {
    return (
      <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '2.25rem', textAlign: 'center' }} className="saas-card">
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--slate-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'var(--slate-700)',
          }}
        >
          <Building2 size={24} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
          Property Profile Not Found
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1.5rem', lineHeight: '1.55' }}>
          The requested hospitality profile is not registered in the system directory. You can register it in 2 minutes:
        </p>
        <button
          type="button"
          className="saas-btn saas-btn-primary"
          onClick={() => setIsRegistryOpen(true)}
          style={{ width: '100%', height: '44px', justifyContent: 'center' }}
        >
          <Plus size={16} />
          <span>Onboard This Property Now</span>
        </button>

        <HotelRegistryModal
          isOpen={isRegistryOpen}
          onClose={() => setIsRegistryOpen(false)}
          onHotelOnboarded={(slug) => navigate(`/${slug}`)}
        />
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh' }}>
      {activeTab === 'guest' ? (
        <GuestReviewCard />
      ) : (
        <TabbedDashboard />
      )}
    </main>
  );
}

function HotelWrapper() {
  const { hotelSlug } = useParams();
  if (!hotelSlug) return <Navigate to="/" replace />;

  return (
    <ErrorBoundary>
      <FeedbackProvider key={hotelSlug} hotelSlug={hotelSlug}>
        <HotelContentWrapper />
      </FeedbackProvider>
    </ErrorBoundary>
  );
}

function HotelContentWrapper() {
  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      <AlertBanner />
      <ManagerPinModal />
      <MainContent />
    </div>
  );
}

function QrRedirectWrapper() {
  const { hotelSlug } = useParams();
  useEffect(() => {
    if (hotelSlug) {
      apiClient(`/api/r/${encodeURIComponent(hotelSlug)}`).catch(() => {});
    }
  }, [hotelSlug]);

  return <Navigate to={`/${hotelSlug}`} replace />;
}

function RootRedirector() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);

  useEffect(() => {
    apiClient(`/api/hotels?_t=${Date.now()}`).then((res) => {
      if (res && res.success && Array.isArray(res.hotels)) {
        setHotels(res.hotels);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--slate-500)', fontSize: '0.9375rem', fontWeight: 500 }}>
        Connecting to Hospitality Review Platform...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '540px', margin: '3.5rem auto', padding: '2.25rem 1.75rem', textAlign: 'center' }} className="saas-card">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <JJLogo size={54} rounded={15} showGlow={true} />
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.35rem', letterSpacing: '-0.03em' }}>
        JJ Review System
      </h1>

      <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1.5rem', lineHeight: '1.55' }}>
        Enterprise Multi-Tenant Hospitality Review & Reputation Intelligence OS.
      </p>

      {hotels.length > 0 && (
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
            Registered Properties ({hotels.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
            {hotels.map((h) => (
              <button
                key={h.hotelSlug || h.hotelId}
                type="button"
                onClick={() => navigate(`/${h.hotelSlug || h.hotelId}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--slate-300)';
                  e.currentTarget.style.background = 'var(--slate-100)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--slate-200)';
                  e.currentTarget.style.background = 'var(--slate-50)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <Building2 size={16} color="var(--slate-500)" />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: '0.875rem' }}>{h.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>/{h.hotelSlug || h.hotelId}</div>
                  </div>
                </div>
                <ArrowRight size={15} color="var(--slate-400)" />
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className="saas-btn saas-btn-primary"
        onClick={() => setIsRegistryOpen(true)}
        style={{ width: '100%', height: '44px', justifyContent: 'center' }}
      >
        <Plus size={16} />
        <span>Onboard New Property</span>
      </button>

      <HotelRegistryModal
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
        onHotelOnboarded={(slug) => navigate(`/${slug}`)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<RootRedirector />} />
        <Route path="/super-admin" element={<SuperAdminPortal />} />
        <Route path="/super" element={<SuperAdminPortal />} />
        <Route path="/admin" element={<SuperAdminPortal />} />
        <Route path="/r/:hotelSlug" element={<QrRedirectWrapper />} />
        <Route path="/:hotelSlug" element={<HotelWrapper />} />
      </Routes>
    </ErrorBoundary>
  );
}
