import React, { useState, useEffect } from 'react';
import {
  Settings, X, Save, RotateCcw, ExternalLink, CheckCircle2, Globe,
  Sparkles, AlertTriangle, Eye, EyeOff, ShieldCheck, Mail, Phone,
  Building2, Search, Tag, Plus, Trash2, Edit2, ToggleLeft, ToggleRight,
  TrendingUp, Layers, Check, MapPin, Link2
} from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { extractPlaceId, generateGoogleReviewUrl, getUrlType } from '../../utils/googleReview';
import { JJLogo } from './JJLogo';

const CATEGORIES = [
  { id: 'all', label: 'All Highlights' },
  { id: 'Rooms', label: 'Rooms & Comfort' },
  { id: 'Food', label: 'Food & Dining' },
  { id: 'Service', label: 'Service & Staff' },
  { id: 'Location', label: 'Location & Amenities' },
  { id: 'General', label: 'General & Value' },
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

  const [activeTab, setActiveTab] = useState('business'); // 'business' | 'links' | 'keywords' | 'security'
  const [formState, setFormState] = useState(settings || {});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password update states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      setFormState(settings || {});
      setSaveSuccess(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
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
    if (e) e.preventDefault();
    setPasswordError('');
    setIsSaving(true);

    try {
      if (newPassword || oldPassword) {
        if (!oldPassword) {
          setPasswordError('Current PIN is required to update security.');
          setIsSaving(false);
          return;
        }
        if (!newPassword || newPassword.length < 4) {
          setPasswordError('New PIN must be at least 4 characters long.');
          setIsSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setPasswordError('New PIN and Confirm PIN do not match.');
          setIsSaving(false);
          return;
        }

        const res = await changeManagerPassword(oldPassword, newPassword, false);
        if (!res.success) {
          setPasswordError(res.error || 'Failed to update PIN. Please check current PIN.');
          setIsSaving(false);
          return;
        }
      }

      await updateSettings(formState);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
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
      setKeywordActionSuccess(`Added suggestion "${item.label}"!`);
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

  return (
    <div className="saas-modal-overlay" onClick={onClose}>
      <div
        className="saas-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '740px',
          width: '94%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--slate-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <JJLogo size={36} rounded={10} showGlow={false} />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#000000', margin: 0, lineHeight: '1.2' }}>
                {formState.hotelName || 'Property'} Settings
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>
                Configure property profile, review links, keywords & security PIN
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="saas-btn saas-btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={18} color="var(--slate-600)" />
          </button>
        </div>

        {/* TABS NAVIGATION */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--slate-200)',
            background: 'var(--slate-50)',
            padding: '0.5rem 1.25rem 0',
            gap: '0.5rem',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'business', label: 'Business Profile', icon: Building2 },
            { id: 'links', label: 'Review Platforms', icon: Globe },
            { id: 'keywords', label: 'Highlight Keywords', icon: Tag },
            { id: 'security', label: 'Security & PIN', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.625rem 1rem',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? 'var(--brand-rose)' : 'var(--slate-600)',
                  background: isActive ? '#FFFFFF' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--slate-200) var(--slate-200) #FFFFFF' : 'transparent',
                  borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  marginBottom: '-1px',
                  transition: 'var(--transition-fast)',
                }}
              >
                <Icon size={14} color={isActive ? 'var(--brand-rose)' : 'var(--slate-500)'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, background: '#FFFFFF' }}>
          {saveSuccess && (
            <div
              className="saas-badge saas-badge-success"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
              }}
            >
              <CheckCircle2 size={18} />
              <span>Settings updated successfully!</span>
            </div>
          )}

          {keywordActionSuccess && (
            <div
              className="saas-badge saas-badge-brand"
              style={{
                width: '100%',
                padding: '0.625rem 1rem',
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
              }}
            >
              <Check size={16} />
              <span>{keywordActionSuccess}</span>
            </div>
          )}

          {/* TAB 1: BUSINESS PROFILE */}
          {activeTab === 'business' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                    Hotel / Business Name *
                  </label>
                  <input
                    type="text"
                    className="saas-input"
                    value={formState.hotelName || ''}
                    onChange={(e) => handleChange('hotelName', e.target.value)}
                    placeholder="e.g. Sree Jee Stay"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                    Location / Subtitle
                  </label>
                  <input
                    type="text"
                    className="saas-input"
                    value={formState.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g. Jodhpur · Rajasthan"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                    Review Generator Tone
                  </label>
                  <select
                    className="saas-input"
                    value={formState.tone || 'friendly'}
                    onChange={(e) => handleChange('tone', e.target.value)}
                    style={{ fontWeight: 600 }}
                  >
                    <option value="friendly">Friendly & Welcoming</option>
                    <option value="professional">Professional & Formal</option>
                    <option value="luxury">Luxury & Editorial</option>
                    <option value="budget">Budget & Value-focused</option>
                    <option value="family">Family & Warm</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                    Logo URL (Optional)
                  </label>
                  <input
                    type="url"
                    className="saas-input"
                    value={formState.logoUrl || ''}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                  Manager Alert Email (For Low Rating Notifications)
                </label>
                <input
                  type="email"
                  className="saas-input"
                  value={formState.managerEmail || ''}
                  onChange={(e) => handleChange('managerEmail', e.target.value)}
                  placeholder="manager@hotel.com"
                />
              </div>
            </div>
          )}

          {/* TAB 2: REVIEW PLATFORMS (GOOGLE & TRIPADVISOR) */}
          {activeTab === 'links' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Google Business Profile Card */}
              <div
                style={{
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Globe size={18} color="var(--brand-rose)" />
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#000000' }}>
                      Google Business Review Link
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenPlaceIdFinder}
                    className="saas-btn saas-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                  >
                    <Search size={12} />
                    <span>Find Google Place ID</span>
                  </button>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                    Google Place ID (Starts with <code>ChIJ...</code>)
                  </label>
                  <input
                    type="text"
                    className="saas-input"
                    value={formState.googlePlaceId || ''}
                    onChange={(e) => handlePlaceIdChange(e.target.value)}
                    placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#000000' }}>
                      Direct Google Review URL
                    </label>
                    <button
                      type="button"
                      onClick={handleTestGoogleLink}
                      className="saas-btn saas-btn-ghost"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: 'var(--brand-rose)', fontWeight: 700 }}
                    >
                      <ExternalLink size={12} />
                      <span>Test Google Link</span>
                    </button>
                  </div>
                  <input
                    type="url"
                    className="saas-input"
                    value={formState.googleReviewUrl || ''}
                    onChange={(e) => handleReviewUrlChange(e.target.value)}
                    placeholder="https://search.google.com/local/writereview?placeid=..."
                  />
                </div>
              </div>

              {/* TripAdvisor Card */}
              <div
                style={{
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#000000' }}>
                    TripAdvisor Profile (Optional)
                  </span>
                  {formState.tripadvisorReviewUrl && (
                    <button
                      type="button"
                      onClick={handleTestTripadvisorLink}
                      className="saas-btn saas-btn-ghost"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: 'var(--brand-rose)', fontWeight: 700 }}
                    >
                      <ExternalLink size={12} />
                      <span>Test TripAdvisor Link</span>
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  className="saas-input"
                  value={formState.tripadvisorReviewUrl || ''}
                  onChange={(e) => handleChange('tripadvisorReviewUrl', e.target.value)}
                  placeholder="https://www.tripadvisor.com/UserReview-..."
                />
              </div>
            </div>
          )}

          {/* TAB 3: KEYWORD HIGHLIGHTS MANAGER */}
          {activeTab === 'keywords' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="saas-btn"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.65rem',
                      background: selectedCategory === cat.id ? 'var(--brand-rose)' : 'var(--slate-100)',
                      color: selectedCategory === cat.id ? '#FFFFFF' : '#000000',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Add New Keyword Form */}
              <form
                onSubmit={handleAddCustomKeyword}
                style={{
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#000000' }}>
                  Add Custom Highlight
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="saas-input"
                    placeholder="e.g. Garden View, High Speed Wi-Fi..."
                    value={newTagLabel}
                    onChange={(e) => setNewTagLabel(e.target.value)}
                    required
                  />

                  <select
                    className="saas-input"
                    value={newTagCategory}
                    onChange={(e) => setNewTagCategory(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Rooms">Rooms</option>
                    <option value="Food">Food</option>
                    <option value="Service">Service</option>
                    <option value="Location">Location</option>
                  </select>

                  <button type="submit" className="saas-btn saas-btn-primary">
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              {/* Active Keywords List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
                {activeKeywordsList.map((item) => (
                  <div
                    key={item.id || item.tagId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: '#FFFFFF',
                      border: '1px solid var(--slate-200)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>
                        {item.category || 'General'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleKeywordActive(item)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: item.isActive !== false ? '#047857' : 'var(--slate-400)' }}
                        title={item.isActive !== false ? 'Active' : 'Disabled'}
                      >
                        {item.isActive !== false ? <ToggleRight size={22} color="#047857" /> : <ToggleLeft size={22} color="#94A3B8" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteKeyword(item)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#DC2626', padding: '2px' }}
                        title="Delete keyword"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & PIN */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#000000', marginBottom: '0.35rem' }}>
                  Update Manager Security PIN
                </div>
                <p style={{ fontSize: '0.78125rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                  This PIN protects the manager dashboard, analytics, and property settings.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                      Current Security PIN *
                    </label>
                    <input
                      type="password"
                      className="saas-input"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••"
                      maxLength={8}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                        New PIN (4+ digits) *
                      </label>
                      <input
                        type="password"
                        className="saas-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••"
                        maxLength={8}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                        Confirm New PIN *
                      </label>
                      <input
                        type="password"
                        className="saas-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••"
                        maxLength={8}
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <div className="saas-badge saas-badge-danger" style={{ width: '100%', padding: '0.5rem' }}>
                      <AlertTriangle size={14} />
                      <span>{passwordError}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Danger Zone: Reset Data */}
              <div
                style={{
                  border: '1px solid #FECDD3',
                  background: '#FFF1F2',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#BE123C' }}>
                    Reset Hotel Submissions
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9F1239' }}>
                    Clear sample feedback records for this property.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="saas-btn saas-btn-danger"
                  style={{ fontSize: '0.78125rem' }}
                >
                  <RotateCcw size={13} />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--slate-200)',
            background: 'var(--slate-50)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="saas-btn saas-btn-secondary"
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="saas-btn saas-btn-primary"
            disabled={isSaving}
            style={{ minWidth: '120px' }}
          >
            <Save size={14} />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
