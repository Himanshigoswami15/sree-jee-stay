import React, { createContext, useContext, useState, useEffect } from 'react';
import { RATING_KEYWORDS } from '../utils/reviewGenerator';
import { generateGoogleReviewUrl, GOOGLE_PLACE_ID } from '../utils/googleReview';
import { normalizeContact } from '../utils/contactNormalizer';
import { getTenantConfig } from '../config/tenantConfig';
import { AuditLogger } from '../utils/auditLogger';

const FeedbackContext = createContext();

export function FeedbackProvider({ children, tenantId = 'demo', locationId = 'main' }) {
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem(`reviewpulse_feedbacks_${tenantId}`);
    // Load empty array if no saved feedback for this tenant
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const tenantConfig = getTenantConfig(tenantId);
    const saved = localStorage.getItem(`reviewpulse_settings_${tenantId}`);
    
    if (saved) {
      const parsed = JSON.parse(saved);
      const placeId = parsed.googlePlaceId !== undefined ? parsed.googlePlaceId : tenantConfig.googlePlaceId;
      const reviewUrl = parsed.googleReviewUrl && !parsed.googleReviewUrl.includes('placeid=https://') && parsed.googleReviewUrl !== 'https://share.google/A2R9wcQuxsaISXwnn'
        ? parsed.googleReviewUrl
        : generateGoogleReviewUrl(placeId);

      return { 
        ...tenantConfig,
        ...parsed, 
        hotelName: parsed.hotelName || tenantConfig.name,
        googlePlaceId: placeId,
        googleReviewUrl: reviewUrl,
        tripadvisorReviewUrl: parsed.tripadvisorReviewUrl || tenantConfig.tripadvisorReviewUrl,
        managerPin: parsed.managerPin || tenantConfig.managerPin,
        preventDuplicateReviews: parsed.preventDuplicateReviews !== undefined ? parsed.preventDuplicateReviews : tenantConfig.preventDuplicateReviews,
      };
    }
    
    return {
      ...tenantConfig,
      hotelName: tenantConfig.name,
      googleReviewUrl: generateGoogleReviewUrl(tenantConfig.googlePlaceId)
    };
  });

  const [keywords, setKeywords] = useState(() => {
    const saved = localStorage.getItem(`reviewpulse_keywords_${tenantId}`);
    return saved ? JSON.parse(saved) : RATING_KEYWORDS;
  });

  const [activeTab, setActiveTab] = useState('guest'); // 'guest' | 'dashboard'
  const [currentRoom, setCurrentRoom] = useState('Room 204');
  const [managerAlertToast, setManagerAlertToast] = useState(null);

  // Security & Authentication state
  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Audit Logger instance
  const auditLogger = new AuditLogger(tenantId, locationId);

  useEffect(() => {
    localStorage.setItem(`reviewpulse_feedbacks_${tenantId}`, JSON.stringify(feedbacks));
  }, [feedbacks, tenantId]);

  useEffect(() => {
    localStorage.setItem(`reviewpulse_settings_${tenantId}`, JSON.stringify(settings));
  }, [settings, tenantId]);

  useEffect(() => {
    localStorage.setItem(`reviewpulse_keywords_${tenantId}`, JSON.stringify(keywords));
  }, [keywords, tenantId]);

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
      auditLogger.logEvent('MANAGER_LOGIN_SUCCESS');
      return true;
    }
    auditLogger.logEvent('MANAGER_LOGIN_FAILED');
    return false;
  };

  // Reset PIN via Email Verification & Directly Open Dashboard
  const resetPinAndAuthenticate = (newPin) => {
    setSettings((prev) => ({ ...prev, managerPin: newPin }));
    setIsManagerAuthenticated(true);
    setIsPinModalOpen(false);
    setActiveTab('dashboard');
    auditLogger.logEvent('MANAGER_PIN_RESET');
    return true;
  };

  // Logout/Lock Manager Dashboard
  const lockDashboard = () => {
    setIsManagerAuthenticated(false);
    setActiveTab('guest');
    auditLogger.logEvent('MANAGER_LOGOUT');
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
      const savedContacts = JSON.parse(localStorage.getItem(`reviewpulse_submitted_contacts_${tenantId}`) || '[]');
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
        auditLogger.logEvent('DUPLICATE_REVIEW_BLOCKED', { contact });
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
    auditLogger.logEvent('FEEDBACK_SUBMITTED', { rating: submission.rating, room: submission.roomNumber });

    // Save contact to localStorage array for persistence
    if (contact) {
      const norm = normalizeContact(contact);
      if (norm) {
        try {
          const saved = JSON.parse(localStorage.getItem(`reviewpulse_submitted_contacts_${tenantId}`) || '[]');
          if (!saved.includes(norm)) {
            saved.push(norm);
            localStorage.setItem(`reviewpulse_submitted_contacts_${tenantId}`, JSON.stringify(saved));
          }
        } catch (e) {}
      }
    }

    if (isLowRating) {
      auditLogger.logEvent('MANAGER_ALERTED', { rating: submission.rating, room: submission.roomNumber });
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
    auditLogger.logEvent('KEYWORD_ADDED', { type, label: tagData.label });
  };

  // Delete keyword tag
  const deleteKeyword = (type, tagId) => {
    setKeywords((prev) => ({
      ...prev,
      [type]: (prev[type] || []).filter((t) => t.id !== tagId),
    }));
    auditLogger.logEvent('KEYWORD_DELETED', { type, tagId });
  };

  // Mark manager alert as resolved
  const resolveAlert = (id) => {
    setFeedbacks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, managerResolved: true, status: 'Manager Resolved' } : item
      )
    );
    auditLogger.logEvent('ALERT_RESOLVED', { id });
  };

  // Clear toast alert
  const dismissAlertToast = () => {
    setManagerAlertToast(null);
  };

  // Update settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      
      // If user did NOT explicitly provide a googleReviewUrl, or if googlePlaceId was changed, generate URL intelligently
      if (newSettings.googlePlaceId && (!newSettings.googleReviewUrl || newSettings.googleReviewUrl === prev.googleReviewUrl)) {
        updated.googleReviewUrl = generateGoogleReviewUrl(newSettings.googlePlaceId);
      } else if (newSettings.googleReviewUrl) {
        updated.googleReviewUrl = generateGoogleReviewUrl(newSettings.googleReviewUrl);
      }
      return updated;
    });
    auditLogger.logEvent('SETTINGS_UPDATED');
  };

  // Reset to seed data
  const resetToDemoData = () => {
    // For demo reset, we don't restore seed feedback in multi-tenant mode to avoid confusion,
    // or we can just empty it. Let's just empty it for simplicity.
    setFeedbacks([]);
    setSettings(getTenantConfig(tenantId));
    setKeywords(RATING_KEYWORDS);
    setIsManagerAuthenticated(false);
    localStorage.removeItem(`reviewpulse_feedbacks_${tenantId}`);
    localStorage.removeItem(`reviewpulse_settings_${tenantId}`);
    localStorage.removeItem(`reviewpulse_keywords_${tenantId}`);
    localStorage.removeItem(`reviewpulse_submitted_contacts_${tenantId}`);
    auditLogger.clearLogs();
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
        resetPinAndAuthenticate,
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
