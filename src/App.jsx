import React, { Component, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { FeedbackProvider, useFeedback } from './context/FeedbackContext';
import { Navigation } from './components/Navigation';
import { AlertBanner } from './components/Common/AlertBanner';
import { ManagerPinModal } from './components/Common/ManagerPinModal';
import { GuestReviewCard } from './components/GuestFlow/GuestReviewCard';
import { TabbedDashboard } from './components/Dashboard/TabbedDashboard';
import { HotelRegistryModal } from './components/Dashboard/HotelRegistryModal';
import { SuperAdminPortal } from './components/Dashboard/SuperAdminPortal';
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
        <div style={{ maxWidth: '520px', margin: '3rem auto', padding: '2rem', textAlign: 'center', background: '#ffffff', borderRadius: '20px', border: '1.5px solid #fca5a5', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4f46e5', marginBottom: '0.5rem' }}>
            JJ Review System
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem' }}>
            Something went wrong loading this view:
          </p>
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '0.75rem', borderRadius: '10px', fontSize: '0.775rem', textAlign: 'left', fontFamily: 'monospace', overflowX: 'auto', marginBottom: '1.25rem', whiteSpace: 'pre-wrap', maxHeight: '200px' }}>
            {this.state.error ? String(this.state.error.stack || this.state.error.message || this.state.error) : 'Unknown Error'}
          </div>
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Reload Page
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
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b', fontWeight: 700 }}>
        Loading Hotel Review System...
      </div>
    );
  }

  if (hotelNotFound) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', textAlign: 'center', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
          🏨 Hotel Not Found
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          The requested hotel profile does not exist in MongoDB Atlas.
        </p>
        <button
          type="button"
          className="btn-primary-action"
          onClick={() => setIsRegistryOpen(true)}
          style={{ width: '100%', padding: '0.75rem' }}
        >
          + Onboard This Hotel Now
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
    <main>
      {activeTab === 'guest' ? (
        <div className="guest-view-container">
          <GuestReviewCard />
        </div>
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
        <div className="app-root">
          <Navigation />
          <AlertBanner />
          <ManagerPinModal />
          <MainContent />
        </div>
      </FeedbackProvider>
    </ErrorBoundary>
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
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b', fontWeight: 700 }}>
        Connecting to JJ Review System...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '560px', margin: '3rem auto', padding: '2rem', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
        JJ Review System
      </h1>
      <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.5' }}>
        Enterprise Multi-Client Guest Review & Analytics Platform. Select a registered hotel or onboard a new business:
      </p>

      {hotels.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Registered Hotel Portals ({hotels.length})
          </div>
          {hotels.map((h) => (
            <button
              key={h.hotelSlug || h.hotelId}
              type="button"
              onClick={() => navigate(`/${h.hotelSlug || h.hotelId}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '14px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{h.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>/{h.hotelSlug || h.hotelId}</div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb' }}>Open Portal &rarr;</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className="btn-primary-action"
        onClick={() => setIsRegistryOpen(true)}
        style={{ width: '100%', padding: '0.85rem' }}
      >
        + Add New Hotel Business
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
