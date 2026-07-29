import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { FeedbackProvider, useFeedback } from './context/FeedbackContext';
import { Navigation } from './components/Navigation';
import { AlertBanner } from './components/Common/AlertBanner';
import { ManagerPinModal } from './components/Common/ManagerPinModal';
import { GuestReviewCard } from './components/GuestFlow/GuestReviewCard';
import { TabbedDashboard } from './components/Dashboard/TabbedDashboard';

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
    <FeedbackProvider hotelSlug={activeSlug}>
      <div className="app-root">
        <Navigation />
        <AlertBanner />
        <ManagerPinModal />
        <MainContent />
      </div>
    </FeedbackProvider>
  );
}

function QrRedirectWrapper() {
  const { hotelSlug } = useParams();
  return <Navigate to={`/${hotelSlug || 'sree-jee-stay'}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sree-jee-stay" replace />} />
      <Route path="/r/:hotelSlug" element={<QrRedirectWrapper />} />
      <Route path="/:hotelSlug" element={<HotelWrapper />} />
    </Routes>
  );
}
