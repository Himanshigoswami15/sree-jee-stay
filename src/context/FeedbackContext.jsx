import React, { createContext, useContext, useState, useEffect } from 'react';
import { RATING_KEYWORDS } from '../utils/reviewGenerator';
import { generateGoogleReviewUrl, GOOGLE_PLACE_ID } from '../utils/googleReview';
import { normalizeContact } from '../utils/contactNormalizer';

const FeedbackContext = createContext();

const INITIAL_SETTINGS = {
  hotelName: 'Sree Jee Stay - Homestay in Varanasi',
  googlePlaceId: GOOGLE_PLACE_ID,
  googleReviewUrl: generateGoogleReviewUrl(GOOGLE_PLACE_ID),
  tripadvisorReviewUrl: 'https://www.tripadvisor.com/UserReview',
  managerEmail: 'info@sreejeestay.com',
  managerPhone: '+91 98765 43210',
  alertThreshold: 3, // Ratings <= 3 trigger manager alert
  antiGatingNoticeEnabled: true,
  managerPin: '1234', // Default Security PIN
  preventDuplicateReviews: true, // Block multiple reviews from same Phone/Customer ID
};

const SEED_FEEDBACKS = [
  {
    id: 'fb-101',
    roomNumber: 'Room 204',
    rating: 5,
    tags: ['clean', 'wifi', 'staff', 'breakfast'],
    reviewText: 'Had a fantastic experience during our stay in Room 204! The room was impeccably clean and spotless. The Wi-Fi was fast and reliable for work and streaming. The staff were incredibly warm, welcoming, and helpful. Will definitely come back again!',
    status: 'Public Posted',
    alertSent: false,
    managerResolved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    guestContact: '',
  },
  {
    id: 'fb-102',
    roomNumber: 'Room 312',
    rating: 2,
    tags: ['ac_issue', 'noise'],
    reviewText: 'Disappointed with our stay in Room 312. Specifically, the air conditioning in the room was not cooling properly, and there was considerable noise disrupting our rest. Hope management can look into these issues promptly.',
    status: 'Manager Alerted',
    alertSent: true,
    managerResolved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    guestContact: 'John D. (Ext: 312, Phone: 555-0192)',
  },
  {
    id: 'fb-103',
    roomNumber: 'Table 14',
    rating: 5,
    tags: ['breakfast', 'staff'],
    reviewText: 'Wonderful stay during our recent visit! Breakfast was fresh, delicious, and offered great variety. The staff were incredibly warm and welcoming.',
    status: 'Public Posted',
    alertSent: false,
    managerResolved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    guestContact: '',
  },
  {
    id: 'fb-104',
    roomNumber: 'Room 108',
    rating: 3,
    tags: ['slow_wifi', 'cold_food'],
    reviewText: 'Mixed experience during our stay in Room 108. A few things could be improved. Specifically, the Wi-Fi connection was unstable and very slow, and the food served was cold and delayed.',
    status: 'Manager Resolved',
    alertSent: true,
    managerResolved: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    guestContact: 'Sarah M. (Room 108)',
  },
  {
    id: 'fb-105',
    roomNumber: 'Room 405',
    rating: 4,
    tags: ['clean', 'bed', 'location'],
    reviewText: 'Really enjoyed our stay in Room 405! The room was impeccably clean and spotless. The bed was super comfortable for a restful sleep.',
    status: 'Submitted',
    alertSent: false,
    managerResolved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 1400).toISOString(),
    guestContact: '',
  },
  {
    id: 'fb-106',
    roomNumber: 'Room 215',
    rating: 1,
    tags: ['dirty_bathroom', 'checkin_delay'],
    reviewText: 'Extremely disappointed with our stay in Room 215. Specifically, the bathroom cleanliness fell below expected standards, and we experienced a long wait time during check-in.',
    status: 'Manager Alerted',
    alertSent: true,
    managerResolved: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 2000).toISOString(),
    guestContact: 'Elena R. (555-8831)',
  }
];

export function FeedbackProvider({ children }) {
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('reviewpulse_feedbacks');
    return saved ? JSON.parse(saved) : SEED_FEEDBACKS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('reviewpulse_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      const placeId = parsed.googlePlaceId || GOOGLE_PLACE_ID;
      return { 
        ...parsed, 
        hotelName: parsed.hotelName || 'Sree Jee Stay - Homestay in Varanasi',
        googlePlaceId: placeId,
        googleReviewUrl: parsed.googleReviewUrl && parsed.googleReviewUrl !== 'https://share.google/A2R9wcQuxsaISXwnn' 
          ? parsed.googleReviewUrl 
          : generateGoogleReviewUrl(placeId),
        managerPin: parsed.managerPin || '1234'
      };
    }
    return INITIAL_SETTINGS;
  });

  const [keywords, setKeywords] = useState(() => {
    const saved = localStorage.getItem('reviewpulse_keywords');
    return saved ? JSON.parse(saved) : RATING_KEYWORDS;
  });

  const [activeTab, setActiveTab] = useState('guest'); // 'guest' | 'dashboard'
  const [currentRoom, setCurrentRoom] = useState('Room 204');
  const [managerAlertToast, setManagerAlertToast] = useState(null);

  // Security & Authentication state
  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('reviewpulse_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('reviewpulse_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('reviewpulse_keywords', JSON.stringify(keywords));
  }, [keywords]);

  // Tab switching with Manager Security Gate
  const switchTab = (tab) => {
    if (tab === 'dashboard' && !isManagerAuthenticated) {
      setIsPinModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  // Verify Security PIN
  const verifyPin = (inputPin) => {
    if (inputPin === settings.managerPin) {
      setIsManagerAuthenticated(true);
      setIsPinModalOpen(false);
      setActiveTab('dashboard');
      return true;
    }
    return false;
  };

  // Logout/Lock Manager Dashboard
  const lockDashboard = () => {
    setIsManagerAuthenticated(false);
    setActiveTab('guest');
  };

  // Check if a phone number or Customer ID has already submitted feedback
  const checkIsDuplicate = (contactStr) => {
    if (!contactStr || !settings.preventDuplicateReviews) return false;
    const norm = normalizeContact(contactStr);
    if (!norm) return false;

    // 1. Check existing feedbacks list
    const isMatched = feedbacks.some(
      (fb) => fb.guestContact && normalizeContact(fb.guestContact) === norm
    );
    if (isMatched) return true;

    // 2. Check localStorage submitted contacts
    try {
      const savedContacts = JSON.parse(localStorage.getItem('reviewpulse_submitted_contacts') || '[]');
      if (savedContacts.includes(norm)) return true;
    } catch (e) {}

    return false;
  };

  // Submit new guest review
  const addFeedback = (newFb) => {
    const contact = newFb.guestContact || '';
    
    // Guard against duplicate submission if phone/customer ID is provided
    if (settings.preventDuplicateReviews && contact) {
      if (checkIsDuplicate(contact)) {
        return {
          success: false,
          isDuplicate: true,
          error: 'DUPLICATE_REVIEW',
          message: `A review has already been submitted for Phone/Customer ID: ${contact}`,
        };
      }
    }

    const isLowRating = newFb.rating <= settings.alertThreshold;
    
    const submission = {
      id: 'fb-' + Date.now().toString(36),
      roomNumber: newFb.roomNumber || currentRoom,
      rating: newFb.rating,
      tags: newFb.tags || [],
      reviewText: newFb.reviewText || '',
      status: isLowRating ? 'Manager Alerted' : (newFb.postedPublic ? 'Public Posted' : 'Submitted'),
      alertSent: isLowRating,
      managerResolved: false,
      timestamp: new Date().toISOString(),
      guestContact: contact,
      postedPublic: newFb.postedPublic || false,
    };

    setFeedbacks((prev) => [submission, ...prev]);

    // Save contact to localStorage array for persistence
    if (contact) {
      const norm = normalizeContact(contact);
      if (norm) {
        try {
          const saved = JSON.parse(localStorage.getItem('reviewpulse_submitted_contacts') || '[]');
          if (!saved.includes(norm)) {
            saved.push(norm);
            localStorage.setItem('reviewpulse_submitted_contacts', JSON.stringify(saved));
          }
        } catch (e) {}
      }
    }

    if (isLowRating) {
      setManagerAlertToast({
        id: submission.id,
        roomNumber: submission.roomNumber,
        rating: submission.rating,
        tags: submission.tags,
        timestamp: submission.timestamp,
        message: `🚨 Low Rating Alert! ${submission.roomNumber} submitted ${submission.rating}-Star Feedback.`,
      });
    }

    return { success: true, submission };
  };

  // Add new custom keyword tag (type = 'positive' | 'negative')
  const addKeyword = (type, tagData) => {
    const newTag = {
      id: 'custom_' + Date.now().toString(36),
      label: tagData.label,
      category: tagData.category || 'General',
      snippet: tagData.snippet || tagData.label,
    };

    setKeywords((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), newTag],
    }));
  };

  // Delete keyword tag
  const deleteKeyword = (type, tagId) => {
    setKeywords((prev) => ({
      ...prev,
      [type]: (prev[type] || []).filter((t) => t.id !== tagId),
    }));
  };

  // Mark manager alert as resolved
  const resolveAlert = (id) => {
    setFeedbacks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, managerResolved: true, status: 'Manager Resolved' } : item
      )
    );
  };

  // Clear toast alert
  const dismissAlertToast = () => {
    setManagerAlertToast(null);
  };

  // Update settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.googlePlaceId) {
        updated.googleReviewUrl = generateGoogleReviewUrl(newSettings.googlePlaceId);
      }
      return updated;
    });
  };

  // Reset to seed data
  const resetToDemoData = () => {
    setFeedbacks(SEED_FEEDBACKS);
    setSettings(INITIAL_SETTINGS);
    setKeywords(RATING_KEYWORDS);
    setIsManagerAuthenticated(false);
    localStorage.removeItem('reviewpulse_feedbacks');
    localStorage.removeItem('reviewpulse_settings');
    localStorage.removeItem('reviewpulse_keywords');
    localStorage.removeItem('reviewpulse_submitted_contacts');
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        settings,
        keywords,
        activeTab,
        setActiveTab: switchTab,
        currentRoom,
        setCurrentRoom,
        managerAlertToast,
        dismissAlertToast,
        isManagerAuthenticated,
        isPinModalOpen,
        setIsPinModalOpen,
        verifyPin,
        lockDashboard,
        checkIsDuplicate,
        addFeedback,
        addKeyword,
        deleteKeyword,
        resolveAlert,
        updateSettings,
        resetToDemoData,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
}
