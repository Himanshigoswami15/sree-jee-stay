import React, { useState, useEffect } from 'react';
import {
  Settings, X, Save, RotateCcw, ExternalLink, CheckCircle2, Globe,
  Sparkles, AlertTriangle, Eye, EyeOff, ShieldCheck, Mail, Phone,
  Building2, Search, Tag, Plus, Trash2, Edit2, ToggleLeft, ToggleRight,
  TrendingUp, Layers, Check
} from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { extractPlaceId, generateGoogleReviewUrl, getUrlType } from '../../utils/googleReview';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'Rooms', label: '🛏️ Rooms & Comfort' },
  { id: 'Food', label: '🍽️ Food & Dining' },
  { id: 'Service', label: '🤝 Service & Staff' },
  { id: 'Location', label: '📍 Location & Amenities' },
  { id: 'General', label: '⭐ General & Value' },
];

const AI_TRENDING_SUGGESTIONS = [
  { label: 'Rooftop Dining', category: 'Food', snippet: 'The rooftop dining experience was spectacular!' },
  { label: 'Family Friendly', category: 'General', snippet: 'Extremely family friendly with warm atmosphere.' },
  { label: 'Fast Check-in', category: 'Service', snippet: 'Seamless and fast check-in process.' },
  { label: 'Great Location', category: 'Location', snippet: 'Great location close to all main attractions.' },
  { label: 'Budget Friendly', category: 'General', snippet: 'Excellent value for money and budget friendly.' },
  { label: 'Clean Washrooms', category: 'Rooms', snippet: 'Sparkling clean washrooms and pristine hygiene.' },
  { label: 'Quiet AC', category: 'Rooms', snippet: 'Quiet and powerful AC for a peaceful night.' },
  { label: 'Superb Breakfast', category: 'Food', snippet: 'Superb breakfast with fresh options.' },
];

export function SettingsModal({ isOpen, onClose }) {
  const {
    settings, updateSettings, changeManagerPassword, resetHotelData,
    keywords, addKeyword, updateKeyword, deleteKeyword
  } = useFeedback();

  const [activeTab, setActiveTab] = useState('business'); // 'business' | 'keywords' | 'trending' | 'security'
  const [formState, setFormState] = useState(settings);
  const [showPin, setShowPin] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password update states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Keyword Management states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [keywordType, setKeywordType] = useState('positive');
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagCategory, setNewTagCategory] = useState('General');
  const [newTagSnippet, setNewTagSnippet] = useState('');
  const [keywordActionSuccess, setKeywordActionSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormState(settings);
      setSaveSuccess(false);
      setShowPin(false);
      setOldPassword('');
      setNewPassword('');
      setPasswordError('');
      setIsSaving(false);
      setNewTagLabel('');
      setNewTagSnippet('');
      setKeywordActionSuccess('');
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormState((prev) => ({ ...prev, [field]: val }));
  };

  const handlePlaceIdChange = (val) => {
    const cleanVal = val.trim();
    const generatedUrl = generateGoogleReviewUrl(cleanVal);
    setFormState((prev) => ({
      ...prev,
      googlePlaceId: cleanVal,
      googleReviewUrl: generatedUrl,
    }));
  };

  const handleReviewUrlChange = (val) => {
    const cleanVal = val.trim();
    const extractedId = extractPlaceId(cleanVal);
    setFormState((prev) => ({
      ...prev,
      googleReviewUrl: val,
      googlePlaceId: extractedId ? extractedId : prev.googlePlaceId,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setIsSaving(true);

    try {
      if (newPassword || oldPassword) {
        if (!oldPassword) {
          setPasswordError('Current Password is required to update your password.');
          setIsSaving(false);
          return;
        }
        if (!newPassword || newPassword.length < 4) {
          setPasswordError('New Password / PIN must be at least 4 characters long.');
          setIsSaving(false);
          return;
        }

        const res = await changeManagerPassword(oldPassword, newPassword, false);
        if (!res.success) {
          setPasswordError(res.error || 'Failed to update password. Please check your current password.');
          setIsSaving(false);
          return;
        }
      }

      updateSettings(formState);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setPasswordError('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all feedback submissions & settings for this hotel back to clean defaults?')) {
      await resetHotelData();
      onClose();
    }
  };

  const handleTestGoogleLink = () => {
    const urlToTest = formState.googleReviewUrl || generateGoogleReviewUrl(formState.googlePlaceId);
    if (urlToTest) {
      window.open(urlToTest, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTestTripadvisorLink = () => {
    if (formState.tripadvisorReviewUrl) {
      window.open(formState.tripadvisorReviewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenPlaceIdFinder = () => {
    window.open('https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder', '_blank', 'noopener,noreferrer');
  };

  // Keyword operations
  const activeKeywordsList = (keywords?.[keywordType] || []).filter((item) => {
    if (selectedCategory === 'all') return true;
    return (item.category || 'General').toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleAddCustomKeyword = async (e) => {
    e.preventDefault();
    if (!newTagLabel.trim()) return;

    const tagId = newTagLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
    const tagData = {
      id: tagId,
      tagId,
      label: newTagLabel.trim(),
      category: newTagCategory || 'General',
      snippet: newTagSnippet.trim() || newTagLabel.trim(),
      snippets: [newTagSnippet.trim() || newTagLabel.trim()],
      isActive: true,
    };

    const res = await addKeyword(keywordType, tagData);
    if (res.success) {
      setNewTagLabel('');
      setNewTagSnippet('');
      setKeywordActionSuccess(`Added "${tagData.label}" successfully!`);
      setTimeout(() => setKeywordActionSuccess(''), 2000);
    }
  };

  const handleAddTrendingSuggestion = async (item) => {
    const tagId = item.label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
    const tagData = {
      id: tagId,
      tagId,
      label: item.label,
      category: item.category,
      snippet: item.snippet,
      snippets: [item.snippet],
      isActive: true,
    };

    const res = await addKeyword('positive', tagData);
    if (res.success) {
      setKeywordActionSuccess(`Added AI Suggestion "${item.label}"!`);
      setTimeout(() => setKeywordActionSuccess(''), 2000);
    }
  };

  const handleToggleKeywordActive = async (item) => {
    const updatedStatus = item.isActive === false;
    await updateKeyword(keywordType, item.id || item.tagId, { isActive: updatedStatus });
  };

  const handleDeleteKeyword = async (item) => {
    if (window.confirm(`Delete keyword "${item.label}"?`)) {
      await deleteKeyword(keywordType, item.id || item.tagId);
    }
  };

  const googleUrlType = getUrlType(formState.googleReviewUrl);

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '780px', width: '92%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Modal Header */}
        <div className="modal-header" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={22} color="var(--primary)" />
            <div>
              <h2 className="modal-title" style={{ margin: 0 }}>{formState.hotelName || 'Business'} Settings & Keywords</h2>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Configure Google link, sentiment keywords & security for this hotel</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0.5rem 1rem 0 1rem', gap: '0.5rem', overflowX: 'auto' }}>
          <button
            type="button"
            onClick={() => setActiveTab('business')}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px 8px 0 0',
              border: '1px solid',
              borderColor: activeTab === 'business' ? '#cbd5e1 #cbd5e1 #ffffff' : 'transparent',
              background: activeTab === 'business' ? '#ffffff' : 'transparent',
              color: activeTab === 'business' ? '#2563eb' : '#64748b',
              fontWeight: activeTab === 'business' ? 700 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Building2 size={15} /> Business Info
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('keywords')}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px 8px 0 0',
              border: '1px solid',
              borderColor: activeTab === 'keywords' ? '#cbd5e1 #cbd5e1 #ffffff' : 'transparent',
              background: activeTab === 'keywords' ? '#ffffff' : 'transparent',
              color: activeTab === 'keywords' ? '#2563eb' : '#64748b',
              fontWeight: activeTab === 'keywords' ? 700 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Tag size={15} /> Review Keywords
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trending')}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px 8px 0 0',
              border: '1px solid',
              borderColor: activeTab === 'trending' ? '#cbd5e1 #cbd5e1 #ffffff' : 'transparent',
              background: activeTab === 'trending' ? '#ffffff' : 'transparent',
              color: activeTab === 'trending' ? '#2563eb' : '#64748b',
              fontWeight: activeTab === 'trending' ? 700 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Sparkles size={15} color="#eab308" /> AI Trending Suggestions
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px 8px 0 0',
              border: '1px solid',
              borderColor: activeTab === 'security' ? '#cbd5e1 #cbd5e1 #ffffff' : 'transparent',
              background: activeTab === 'security' ? '#ffffff' : 'transparent',
              color: activeTab === 'security' ? '#2563eb' : '#64748b',
              fontWeight: activeTab === 'security' ? 700 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap'
            }}
          >
            <ShieldCheck size={15} /> Security & Password
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>

          {saveSuccess && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #6ee7b7',
              color: '#065f46',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              <CheckCircle2 size={22} color="#059669" />
              <div>Settings & Keywords Updated Successfully in MongoDB Cloud!</div>
            </div>
          )}

          {keywordActionSuccess && (
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e40af',
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Check size={16} color="#2563eb" /> {keywordActionSuccess}
            </div>
          )}

          {/* TAB 1: Business Information */}
          {activeTab === 'business' && (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building2 size={15} color="#2563eb" /> Business / Hotel Name:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formState.hotelName || ''}
                  onChange={(e) => handleChange('hotelName', e.target.value)}
                  placeholder="e.g. Grand Hyatt Resort"
                  required
                />
              </div>

              <div className="form-group" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem 1rem', borderRadius: '12px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#166534', fontWeight: 800 }}>
                  <Sparkles size={15} color="#16a34a" /> Review Generator Writing Tone:
                </label>
                <select
                  className="form-input"
                  value={formState.tone || 'friendly'}
                  onChange={(e) => handleChange('tone', e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  <option value="friendly">😊 Friendly & Conversational</option>
                  <option value="professional">💼 Professional & Formal</option>
                  <option value="luxury">👑 Luxury & Elegant</option>
                  <option value="budget">🏷️ Budget & Value-focused</option>
                  <option value="family">👨‍👩‍👧‍👦 Family & Warm</option>
                  <option value="business">📈 Business & Efficient</option>
                </select>
              </div>

              {/* Google Business Profile Configuration */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e293b', fontWeight: 700, fontSize: '0.925rem' }}>
                    <Globe size={18} color="#2563eb" />
                    <span>Google Business Profile Configuration</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenPlaceIdFinder}
                    style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '0.25rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Search size={12} /> Find My Google Place ID
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Google Place ID (Starts with <code>ChIJ...</code>):</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formState.googlePlaceId || ''}
                    onChange={(e) => handlePlaceIdChange(e.target.value)}
                    placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Generated Google Review Link:</label>
                    <button
                      type="button"
                      onClick={handleTestGoogleLink}
                      style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.2rem 0.55rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <ExternalLink size={12} /> Test Link Now
                    </button>
                  </div>
                  <input
                    type="url"
                    className="form-input"
                    value={formState.googleReviewUrl || ''}
                    onChange={(e) => handleReviewUrlChange(e.target.value)}
                    placeholder="https://search.google.com/local/writereview?placeid=..."
                    required
                  />
                </div>
              </div>

              {/* Duty Manager Contacts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={15} color="#0284c7" /> Manager Email:
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={formState.managerEmail || ''}
                    onChange={(e) => handleChange('managerEmail', e.target.value)}
                    placeholder="manager@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={15} color="#16a34a" /> Manager Phone:
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formState.managerPhone || ''}
                    onChange={(e) => handleChange('managerPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary-action" onClick={onClose} style={{ width: 'auto' }}>Cancel</button>
                <button type="submit" className="btn-primary-action" style={{ width: 'auto' }}>
                  <Save size={16} /> Save Business Info
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Review Keywords Manager */}
          {activeTab === 'keywords' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Type Switcher & Category Pills */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.35rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setKeywordType('positive')}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: keywordType === 'positive' ? '#2563eb' : 'transparent',
                      color: keywordType === 'positive' ? '#ffffff' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Positive Keywords (4-5 ★)
                  </button>

                  <button
                    type="button"
                    onClick={() => setKeywordType('negative')}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: keywordType === 'negative' ? '#ef4444' : 'transparent',
                      color: keywordType === 'negative' ? '#ffffff' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Improvement Tags (1-3 ★)
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: selectedCategory === cat.id ? '#2563eb' : '#cbd5e1',
                        background: selectedCategory === cat.id ? '#eff6ff' : '#ffffff',
                        color: selectedCategory === cat.id ? '#1d4ed8' : '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: selectedCategory === cat.id ? 700 : 600,
                        cursor: 'pointer'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Custom Keyword Form */}
              <form onSubmit={handleAddCustomKeyword} style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', padding: '1rem', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 120px 1.5fr auto', gap: '0.75rem', alignItems: 'end', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b', display: 'block', marginBottom: '0.3rem' }}>Keyword Label:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Superb Breakfast"
                    value={newTagLabel}
                    onChange={(e) => setNewTagLabel(e.target.value)}
                    required
                    style={{ height: '40px', padding: '0 0.65rem', fontSize: '0.85rem', color: '#0f172a' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b', display: 'block', marginBottom: '0.3rem' }}>Category:</label>
                  <select
                    className="form-input"
                    value={newTagCategory}
                    onChange={(e) => setNewTagCategory(e.target.value)}
                    style={{ height: '40px', padding: '0 0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}
                  >
                    <option value="General">General</option>
                    <option value="Rooms">Rooms</option>
                    <option value="Food">Food</option>
                    <option value="Service">Service</option>
                    <option value="Location">Location</option>
                    <option value="Performance">Performance</option>
                    <option value="Pricing">Pricing</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b', display: 'block', marginBottom: '0.3rem' }}>AI Review Snippet:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Delicious breakfast served hot!"
                    value={newTagSnippet}
                    onChange={(e) => setNewTagSnippet(e.target.value)}
                    style={{ height: '40px', padding: '0 0.65rem', fontSize: '0.85rem', color: '#0f172a' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    height: '40px',
                    padding: '0 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(37,99,235,0.25)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Plus size={16} /> Save Keyword Tag
                </button>
              </form>

              {/* Active Keywords List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto' }}>
                {activeKeywordsList.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    No keywords found in this category. Click <strong>"AI Trending Suggestions"</strong> or add a new tag above!
                  </div>
                ) : (
                  activeKeywordsList.map((item) => (
                    <div
                      key={item.id || item.tagId}
                      style={{
                        background: item.isActive === false ? '#f8fafc' : '#ffffff',
                        border: '1px solid',
                        borderColor: item.isActive === false ? '#e2e8f0' : '#cbd5e1',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        opacity: item.isActive === false ? 0.55 : 1,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>{item.label}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleKeywordActive(item)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                          title={item.isActive === false ? "Enable Tag" : "Disable Tag"}
                        >
                          {item.isActive === false ? (
                            <ToggleLeft size={20} color="#94a3b8" />
                          ) : (
                            <ToggleRight size={20} color="#16a34a" />
                          )}
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                        <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.675rem', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                          {item.category || 'General'}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteKeyword(item)}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                          title="Delete Tag"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AI Trending Suggestions */}
          {activeTab === 'trending' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem 1rem', borderRadius: '12px', color: '#166534', fontSize: '0.85rem', lineHeight: '1.4' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <Sparkles size={16} color="#16a34a" /> AI High-Converting Guest Review Tags
                </strong>
                Click <strong>[ + Add Tag ]</strong> below to instantly add industry-popular sentiment keywords directly to your guest review portal!
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '0.85rem' }}>
                {AI_TRENDING_SUGGESTIONS.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>✓ {item.label}</span>
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                          {item.category}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.35rem 0 0.75rem 0', fontStyle: 'italic' }}>
                        "{item.snippet}"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddTrendingSuggestion(item)}
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.45rem 0.75rem',
                        fontSize: '0.775rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Plus size={14} /> Add to Hotel Keywords
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Security & Password */}
          {activeTab === 'security' && (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e293b', fontWeight: 700, fontSize: '0.925rem' }}>
                  <ShieldCheck size={18} color="#4f46e5" />
                  <span>Change Manager Password / Security PIN</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Current Password / PIN:</label>
                    <input
                      type="password"
                      maxLength={16}
                      className="form-input"
                      value={oldPassword}
                      onChange={(e) => { setOldPassword(e.target.value); setPasswordError(''); }}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>New Password / PIN:</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showPin ? "text" : "password"}
                        maxLength={16}
                        className="form-input"
                        style={{ paddingRight: '2.5rem' }}
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); }}
                        placeholder="Enter new password (min 4)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        style={{ position: 'absolute', right: '0.75rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                      >
                        {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Alert Threshold (Stars):</label>
                <select
                  className="form-input"
                  value={formState.alertThreshold || 3}
                  onChange={(e) => handleChange('alertThreshold', parseInt(e.target.value, 10))}
                >
                  <option value={3}>≤ 3 Stars (Alert Manager)</option>
                  <option value={2}>≤ 2 Stars (Urgent Only)</option>
                  <option value={1}>1 Star Only</option>
                </select>
              </div>

              <div className="form-group" style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>
                  <input
                    type="checkbox"
                    checked={formState.preventDuplicateReviews !== false}
                    onChange={(e) => handleChange('preventDuplicateReviews', e.target.checked)}
                    style={{ width: '17px', height: '17px', accentColor: '#2563eb' }}
                  />
                  <span>Prevent Multiple Reviews from Same Phone / Customer ID</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary-action"
                  style={{ width: 'auto', padding: '0.6rem 1rem', color: '#ef4444' }}
                  onClick={handleReset}
                >
                  <RotateCcw size={14} /> Reset Business Data
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className="btn-secondary-action" onClick={onClose} style={{ width: 'auto' }}>Cancel</button>
                  <button type="submit" className="btn-primary-action" style={{ width: 'auto' }}>
                    <Save size={16} /> Save Security Settings
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
