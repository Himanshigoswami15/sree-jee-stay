import React from 'react';
import { FeedbackProvider, useFeedback } from './context/FeedbackContext';
import { Navigation } from './components/Navigation';
import { AlertBanner } from './components/Common/AlertBanner';
import { ManagerPinModal } from './components/Common/ManagerPinModal';
import { GuestReviewCard } from './components/GuestFlow/GuestReviewCard';
import { MetricsOverview } from './components/Dashboard/MetricsOverview';
import { TagAnalytics } from './components/Dashboard/TagAnalytics';
import { FeedbackTable } from './components/Dashboard/FeedbackTable';
import { KeywordStudio } from './components/Dashboard/KeywordStudio';

function MainContent() {
  const { activeTab, feedbacks, settings } = useFeedback();

  return (
    <main>
      {activeTab === 'guest' ? (
        <div className="guest-view-container">
          <GuestReviewCard />
        </div>
      ) : (
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div className="dashboard-title-group">
              <h1>{settings.hotelName} — Guest Insights</h1>
              <p>Real-time analytics, keyword trends, duty manager alerts & policy-compliant review routing</p>
            </div>
          </div>

          <MetricsOverview
            feedbacks={feedbacks}
            alertThreshold={settings.alertThreshold}
          />

          <TagAnalytics feedbacks={feedbacks} />

          <KeywordStudio />

          <FeedbackTable feedbacks={feedbacks} />
        </div>
      )}
    </main>
  );
}

export default function App() {
  return (
    <FeedbackProvider>
      <div className="app-root">
        <Navigation />
        <AlertBanner />
        <ManagerPinModal />
        <MainContent />
      </div>
    </FeedbackProvider>
  );
}
