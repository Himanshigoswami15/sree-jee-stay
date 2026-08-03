import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { RATING_KEYWORDS } from '../utils/reviewGenerator';
import { getHotelConfig } from '../config/hotelConfig';
import { AuditLogger } from '../utils/auditLogger';
import { verifyPasswordApi, changePasswordApi, logoutApi } from '../services/authService';
import { apiClient } from '../services/apiClient';

const FeedbackContext = createContext();

export function FeedbackProvider({ children, hotelSlug }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [settings, setSettings] = useState(() => getHotelConfig(hotelSlug) || {});
  const [keywords, setKeywords] = useState(RATING_KEYWORDS);
  const [registeredHotels, setRegisteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hotelNotFound, setHotelNotFound] = useState(false);

  const [activeTab, setActiveTab] = useState('guest'); // 'guest' | 'dashboard'
  const [managerAlertToast, setManagerAlertToast] = useState(null);

  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const auditLogger = new AuditLogger(hotelSlug);

  const fetchHotelsList = useCallback(async () => {
    try {
      const res = await apiClient(`/api/hotels?_t=${Date.now()}`);
      if (res && res.success && Array.isArray(res.hotels)) {
        const serverHotels = res.hotels.map(h => ({
          hotelSlug: h.hotelSlug || h.hotelId,
          name: h.name || h.hotelName || h.hotelSlug
        }));
        setRegisteredHotels(serverHotels);
      }
    } catch (e) {}
  }, []);

  const fetchData = useCallback(async () => {
    if (!hotelSlug) return;
    setLoading(true);
    setHotelNotFound(false);

    try {
      fetchHotelsList();

      const t = Date.now();
      const [settingsRes, keywordsRes, feedbackRes] = await Promise.all([
        apiClient(`/api/settings?hotelSlug=${encodeURIComponent(hotelSlug)}&_t=${t}`),
        apiClient(`/api/keywords?hotelSlug=${encodeURIComponent(hotelSlug)}&_t=${t}`),
        apiClient(`/api/feedback?hotelSlug=${encodeURIComponent(hotelSlug)}&_t=${t}`),
      ]);

      if (settingsRes && settingsRes.success && settingsRes.settings) {
        setSettings(settingsRes.settings);
      } else {
        setHotelNotFound(true);
      }

      if (keywordsRes && keywordsRes.success && keywordsRes.keywords) {
        setKeywords(keywordsRes.keywords);
      }

      if (feedbackRes && feedbackRes.success && Array.isArray(feedbackRes.feedbacks)) {
        setFeedbacks(feedbackRes.feedbacks);
      }
    } catch (err) {
      console.warn('[FeedbackContext] Error loading initial data from server:', err);
    } finally {
      setLoading(false);
    }
  }, [hotelSlug, fetchHotelsList]);

  const prevHotelSlugRef = useRef(hotelSlug);

  useEffect(() => {
    if (prevHotelSlugRef.current !== hotelSlug) {
      prevHotelSlugRef.current = hotelSlug;
      setIsManagerAuthenticated(false);
      logoutApi();
      if (activeTab === 'dashboard') {
        setIsPinModalOpen(true);
      }
    }
  }, [hotelSlug, activeTab]);

  useEffect(() => {
    if (!hotelSlug) return;

    apiClient('/api/auth/me').then((res) => {
      if (
        res &&
        res.success &&
        res.authenticated &&
        res.user &&
        (res.user.hotelSlug === hotelSlug || res.user.hotelId === hotelSlug)
      ) {
        setIsManagerAuthenticated(true);
      } else {
        setIsManagerAuthenticated(false);
      }
    });

    fetchData();

    // Native Server-Sent Events (SSE) Real-Time Connection
    let eventSource = null;
    try {
      const sseUrl = `/api/events/stream?hotelSlug=${encodeURIComponent(hotelSlug)}`;
      eventSource = new EventSource(sseUrl, { withCredentials: true });

      eventSource.onmessage = (e) => {
        try {
          const eventData = JSON.parse(e.data);
          if (eventData.type !== 'CONNECTED') {
            fetchData();
          }
        } catch (err) {}
      };
    } catch (e) {}

    // BroadcastChannel listener for instant cross-tab sync
    let bc = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('jj_system_sync');
        bc.onmessage = (event) => {
          if (event.data && (event.data.hotelSlug === hotelSlug || !event.data.hotelSlug)) {
            fetchData();
          }
        };
      } catch (e) {}
    }

    return () => {
      if (eventSource) eventSource.close();
      if (bc) bc.close();
    };
  }, [hotelSlug, fetchData]);

  const switchTab = (tab) => {
    if (tab === 'dashboard' && !isManagerAuthenticated) {
      setIsPinModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const verifyPin = async (inputPin) => {
    try {
      const result = await verifyPasswordApi(hotelSlug, inputPin);
      if (result.success) {
        setIsManagerAuthenticated(true);
        setIsPinModalOpen(false);
        setActiveTab('dashboard');
        auditLogger.logEvent('MANAGER_LOGIN_SUCCESS');
        fetchData();
        return { success: true };
      }

      auditLogger.logEvent('MANAGER_LOGIN_FAILED');
      return { success: false, error: result.error || 'Incorrect Security PIN / Password.' };
    } catch (err) {
      return { success: false, error: 'Network error verifying password.' };
    }
  };

  const changeManagerPassword = async (oldPassword, newPassword, isOtpReset = false) => {
    const result = await changePasswordApi(hotelSlug, oldPassword, newPassword, isOtpReset);
    if (result.success) {
      auditLogger.logEvent(isOtpReset ? 'MANAGER_PIN_RESET' : 'MANAGER_PASSWORD_CHANGED');
      return { success: true, message: result.message };
    }
    return { success: false, error: result.error || 'Failed to update password.' };
  };

  const authenticateAndOpenDashboard = () => {
    setIsManagerAuthenticated(true);
    setIsPinModalOpen(false);
    setActiveTab('dashboard');
    auditLogger.logEvent('MANAGER_LOGIN_SUCCESS');
    fetchData();
  };

  const resetPinAndAuthenticate = async (newPin) => {
    const result = await changePasswordApi(hotelSlug, '', newPin, true);
    if (result.success) {
      setIsManagerAuthenticated(true);
      setIsPinModalOpen(false);
      setActiveTab('dashboard');
      auditLogger.logEvent('MANAGER_PIN_RESET');
      fetchData();
      return { success: true };
    }
    return { success: false, error: result.error || 'Failed to reset password.' };
  };

  const lockDashboard = () => {
    logoutApi();
    setIsManagerAuthenticated(false);
    setActiveTab('guest');
    auditLogger.logEvent('MANAGER_LOGOUT');
  };

  const checkIsDuplicate = (contactStr) => {
    if (!contactStr || !settings?.preventDuplicateReviews) return false;
    return feedbacks.some((fb) => fb.guestContact && fb.guestContact === contactStr);
  };

  const addFeedback = async (newFb) => {
    const submissionData = {
      hotelSlug,
      rating: newFb.rating,
      tags: newFb.tags || [],
      reviewText: newFb.reviewText || '',
      guestContact: newFb.guestContact || '',
      postedPublic: newFb.postedPublic || false,
    };

    const res = await apiClient('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });

    if (res.isDuplicate) {
      auditLogger.logEvent('DUPLICATE_REVIEW_BLOCKED', { contact: newFb.guestContact });
      return {
        success: false,
        isDuplicate: true,
        error: 'DUPLICATE_REVIEW',
        message: res.message || `A review has already been submitted for Phone/Customer ID: ${newFb.guestContact}`,
      };
    }

    if (!res.success) {
      return { success: false, error: res.error || 'Failed to submit review.' };
    }

    const submission = res.submission;
    setFeedbacks((prev) => [submission, ...prev]);

    const isLowRating = submission.rating <= (settings?.alertThreshold || 3);
    if (isLowRating) {
      setManagerAlertToast({
        id: submission.id,
        rating: submission.rating,
        tags: submission.tags,
        timestamp: submission.timestamp,
        message: `🚨 Low Rating Alert! Guest submitted ${submission.rating}-Star Feedback.`,
      });
    }

    return { success: true, submission };
  };

  const addKeyword = async (type, tagData) => {
    const res = await apiClient('/api/keywords', {
      method: 'POST',
      body: JSON.stringify({ hotelSlug, type, ...tagData }),
    });

    if (res && res.success && res.keywords) {
      setKeywords(res.keywords);
      return { success: true, keyword: res.keyword };
    }

    return { success: false, error: res?.error || 'Failed to add keyword tag.' };
  };

  const updateKeyword = async (type, tagId, updatedFields) => {
    const res = await apiClient(`/api/keywords/${tagId}`, {
      method: 'PUT',
      body: JSON.stringify({ hotelSlug, type, ...updatedFields }),
    });

    if (res && res.success && res.keywords) {
      setKeywords(res.keywords);
      return { success: true };
    }

    return { success: false, error: res?.error || 'Failed to update keyword tag.' };
  };

  const deleteKeyword = async (type, tagId) => {
    const res = await apiClient(`/api/keywords/${tagId}?hotelSlug=${encodeURIComponent(hotelSlug)}&type=${type}`, {
      method: 'DELETE',
    });

    if (res && res.success && res.keywords) {
      setKeywords(res.keywords);
      return { success: true };
    }

    return { success: false, error: res?.error || 'Failed to delete keyword tag.' };
  };

  const reorderKeywords = async (type, newOrderedList) => {
    const res = await apiClient('/api/keywords/reorder', {
      method: 'POST',
      body: JSON.stringify({ hotelSlug, type, tagIds: newOrderedList.map((k) => k.id || k.tagId) }),
    });

    if (res && res.success && res.keywords) {
      setKeywords(res.keywords);
    }
  };

  const applyIndustryTemplate = async (templateKey) => {
    const { INDUSTRY_TEMPLATES } = await import('../config/industryTemplates');
    const template = INDUSTRY_TEMPLATES[templateKey];
    if (!template) return { success: false, error: 'Invalid template' };

    const newKeywordsList = template.keywords.map((k, idx) => ({
      id: k.id,
      tagId: k.id,
      label: k.label,
      category: k.category,
      snippet: k.snippet,
      snippets: k.snippets || [k.snippet || k.label],
      sortOrder: idx,
      isActive: true,
    }));

    const res = await apiClient('/api/keywords/template', {
      method: 'POST',
      body: JSON.stringify({ hotelSlug, templateKey, keywords: newKeywordsList }),
    });

    if (res && res.success && res.keywords) {
      setKeywords(res.keywords);
      return { success: true, count: res.count || newKeywordsList.length };
    }

    return { success: false, error: res?.error || 'Failed to apply keyword template.' };
  };

  const resolveAlert = async (id) => {
    const res = await apiClient(`/api/feedback/${id}/resolve`, { method: 'POST' });

    if (res && res.success) {
      setFeedbacks((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, managerResolved: true, status: 'Manager Resolved' } : item
        )
      );
    }
  };

  const dismissAlertToast = () => {
    setManagerAlertToast(null);
  };

  const updateSettings = async (newSettings) => {
    const res = await apiClient('/api/settings', {
      method: 'PUT',
      body: JSON.stringify({ hotelSlug, ...newSettings }),
    });

    if (res && res.success && res.settings) {
      setSettings(res.settings);
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('jj_system_sync');
          bc.postMessage({ type: 'SETTINGS_UPDATED', hotelSlug, settings: res.settings });
          bc.close();
        } catch (e) {}
      }
      return { success: true, settings: res.settings };
    }

    return { success: false, error: res?.error || 'Failed to update settings in database.' };
  };

  const registerHotel = (newHotel) => {
    if (!newHotel || (!newHotel.hotelSlug && !newHotel.slug)) return;
    const slug = newHotel.hotelSlug || newHotel.slug;
    const name = newHotel.name || newHotel.hotelName || slug;

    setRegisteredHotels((prev) => {
      const exists = prev.some(h => h.hotelSlug === slug);
      if (exists) return prev;
      return [...prev, { hotelSlug: slug, name }];
    });
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        settings,
        keywords,
        registeredHotels,
        refreshHotels: fetchHotelsList,
        registerHotel,
        loading,
        hotelNotFound,
        activeTab,
        setActiveTab: switchTab,
        managerAlertToast,
        dismissAlertToast,
        isManagerAuthenticated,
        isPinModalOpen,
        setIsPinModalOpen,
        verifyPin,
        changeManagerPassword,
        resetPinAndAuthenticate,
        authenticateAndOpenDashboard,
        lockDashboard,
        checkIsDuplicate,
        addFeedback,
        addKeyword,
        updateKeyword,
        deleteKeyword,
        reorderKeywords,
        applyIndustryTemplate,
        resolveAlert,
        updateSettings,
        refreshData: fetchData,
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
