import React, { Component } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { FeedbackProvider, useFeedback } from './context/FeedbackContext';
import { Navigation } from './components/Navigation';
import { AlertBanner } from './components/Common/AlertBanner';
import { ManagerPinModal } from './components/Common/ManagerPinModal';
import { GuestReviewCard } from './components/GuestFlow/GuestReviewCard';
import { TabbedDashboard } from './components/Dashboard/TabbedDashboard';

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
        <div style={{ maxWidth: '440px', margin: '3rem auto', padding: '2rem', textAlign: 'center', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4f46e5', marginBottom: '0.5rem' }}>
            JJ Review System
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
            Something went wrong loading this view. Please click below to refresh.
          </p>
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
  const { activeTab } = useFeedback();

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
  const activeSlug = hotelSlug || 'sree-jee-stay';

  return (
    <ErrorBoundary>
      <FeedbackProvider hotelSlug={activeSlug}>
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
  return <Navigate to={`/${hotelSlug || 'sree-jee-stay'}`} replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/sree-jee-stay" replace />} />
        <Route path="/r/:hotelSlug" element={<QrRedirectWrapper />} />
        <Route path="/:hotelSlug" element={<HotelWrapper />} />
      </Routes>
    </ErrorBoundary>
  );
}
