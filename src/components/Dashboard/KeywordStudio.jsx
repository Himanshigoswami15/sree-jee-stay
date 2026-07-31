import React, { useState } from 'react';
import {
  Sparkles, Plus, Trash2, Check, ThumbsUp, AlertCircle, Edit2,
  ArrowUp, ArrowDown, Smartphone, CheckCircle2,
  Hotel, Utensils, Stethoscope, Scissors, Dumbbell, Coffee, X, Star, Eye
} from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { INDUSTRY_TEMPLATES } from '../../config/industryTemplates';
import { generateReviewText, evaluateReviewStrength } from '../../utils/reviewGenerator';

const ALL_CATEGORIES = [
  'SEO',
  'Google Ads',
  'Meta Ads',
  'Social Media',
  'Website',
  'Service',
  'Communication',
  'Project Management',
  'Results',
  'Pricing',
  'Content Writing',
  'Graphic Design',
  'Branding',
  'Lead Generation',
  'Local SEO',
  'Google Business Profile (GBP)',
  'Reporting',
  'Strategy',
  'Technical Support',
  'Customer Support',
  'Timeline',
  'Performance',
  'Account Management',
  'Consultation',
  'Transparency',
  'Amenities',
  'Cleanliness',
  'Dining',
  'Comfort',
  'General',
];

export function KeywordStudio() {
  const {
    keywords,
    settings,
    addKeyword,
    updateKeyword,
    deleteKeyword,
    reorderKeywords,
    applyIndustryTemplate,
    updateSettings
  } = useFeedback();

  const [activeTab, setActiveTab] = useState('positive'); // 'positive' | 'negative'
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingTagId, setEditingTagId] = useState(null);
  const [inlineLabel, setInlineLabel] = useState('');
  const [inlineCategory, setInlineCategory] = useState('General');

  // Modals & Banners
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Form State for new keyword
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState('Service');
  const [newSnippet, setNewSnippet] = useState('');

  // Live Simulator Interactive State
  const [previewRating, setPreviewRating] = useState(5);
  const [previewSelectedTags, setPreviewSelectedTags] = useState([]);

  const currentList = activeTab === 'positive'
    ? (keywords?.positive || [])
    : (keywords?.negative || []);

  const handleStartInlineEdit = (tag) => {
    const id = tag.id || tag.tagId;
    setEditingTagId(id);
    setInlineLabel(tag.label);
    setInlineCategory(tag.category || 'General');
  };

  const handleSaveInlineEdit = async (tag) => {
    const id = tag.id || tag.tagId;
    if (!inlineLabel.trim()) return;

    await updateKeyword(activeTab, id, {
      label: inlineLabel.trim(),
      category: inlineCategory,
      snippet: tag.snippet || inlineLabel.trim(),
    });

    setEditingTagId(null);
    setStatusMessage(`Updated "${inlineLabel.trim()}"`);
    setTimeout(() => setStatusMessage(''), 2500);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    await addKeyword(activeTab, {
      label: newLabel.trim(),
      category: newCategory.trim() || 'General',
      snippet: newSnippet.trim() || newLabel.trim(),
    });

    setStatusMessage(`Added "${newLabel.trim()}" highlight.`);
    setNewLabel('');
    setNewCategory('Service');
    setNewSnippet('');
    setIsAddFormOpen(false);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleMove = (index, direction) => {
    const newList = [...currentList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;

    const [moved] = newList.splice(index, 1);
    newList.splice(targetIndex, 0, moved);

    reorderKeywords(activeTab, newList);
  };

  const handleApplyTemplate = async (key) => {
    setSelectedTemplateKey(key);
    setTemplateModalOpen(true);
  };

  const confirmApplyTemplate = async () => {
    if (!selectedTemplateKey) return;
    const res = await applyIndustryTemplate(selectedTemplateKey);
    setTemplateModalOpen(false);
    if (res.success) {
      setStatusMessage(`Loaded ${res.count} highlights for ${INDUSTRY_TEMPLATES[selectedTemplateKey]?.name}!`);
      setTimeout(() => setStatusMessage(''), 3500);
    }
  };

  const togglePreviewTag = (tagId) => {
    setPreviewSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const generatedPreviewText = generateReviewText({
    rating: previewRating,
    selectedTags: previewSelectedTags,
    hotelName: settings.hotelName || 'Sree Jee Stay',
    tone: settings.tone || 'friendly',
    reviewLength: settings.reviewLength || 'short',
    keywordsList: keywords,
  });

  const reviewMetrics = evaluateReviewStrength(generatedPreviewText, previewSelectedTags);

  const getTemplateIconComponent = (key) => {
    switch (key) {
      case 'hotel': return <Hotel size={16} />;
      case 'restaurant': return <Utensils size={16} />;
      case 'clinic': return <Stethoscope size={16} />;
      case 'salon': return <Scissors size={16} />;
      case 'gym': return <Dumbbell size={16} />;
      case 'cafe': return <Coffee size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  const tonesList = [
    { key: 'friendly', label: '😊 Friendly' },
    { key: 'casual', label: '😎 Casual' },
    { key: 'luxury', label: '✨ Luxury' },
    { key: 'professional', label: '💼 Professional' },
    { key: 'minimal', label: '⚡ Minimal' },
    { key: 'family', label: '🏡 Family' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* CARD HEADER & DESCRIPTION */}
      <div className="chart-card">
        <div className="chart-title" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4f46e5', fontSize: '1.25rem', fontWeight: 800 }}>
            <Star size={24} color="#f59e0b" fill="#f59e0b" /> Review Highlights
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.825rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
            >
              <Smartphone size={16} /> Preview Customer Experience
            </button>
            <span style={{ fontSize: '0.75rem', color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={14} color="#059669" /> Live Sync with Guest Page
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.5', fontWeight: 500, margin: '0.5rem 0 1rem' }}>
          Configure what customers love about your business. When customers tap these highlights, AI generates natural, high-ranking Google reviews mentioning your specific services and qualities.
        </p>

        {/* STATUS NOTIFICATION BANNER */}
        {statusMessage && (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '0.6rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={16} color="#166534" /> {statusMessage}
          </div>
        )}

        {/* AI TONE SELECTOR BAR */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.85rem 1rem', borderRadius: '14px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} color="#4f46e5" /> AI Review Tone:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {tonesList.map((t) => {
              const isSelected = (settings.tone || 'friendly') === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => updateSettings({ tone: t.key })}
                  style={{
                    fontSize: '0.775rem',
                    fontWeight: isSelected ? 800 : 600,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    border: isSelected ? '1.5px solid #4f46e5' : '1px solid #cbd5e1',
                    background: isSelected ? '#eeeffe' : '#f8fafc',
                    color: isSelected ? '#4f46e5' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1-CLICK INDUSTRY PRESETS */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '16px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} color="#4f46e5" /> Quick Load Industry Preset Highlights:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.keys(INDUSTRY_TEMPLATES).map((key) => {
              const tmpl = INDUSTRY_TEMPLATES[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleApplyTemplate(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {getTemplateIconComponent(key)}
                  <span>{tmpl.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB SWITCHER & ADD BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="nav-tabs" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '4px', borderRadius: '12px' }}>
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'positive' ? 'active' : ''}`}
              onClick={() => setActiveTab('positive')}
              style={{
                background: activeTab === 'positive' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                color: activeTab === 'positive' ? '#ffffff' : '#475569',
                boxShadow: activeTab === 'positive' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                fontWeight: 700
              }}
            >
              <ThumbsUp size={14} /> Positive Highlights (4-5 Stars)
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'negative' ? 'active' : ''}`}
              onClick={() => setActiveTab('negative')}
              style={{
                background: activeTab === 'negative' ? 'linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)' : 'transparent',
                color: activeTab === 'negative' ? '#ffffff' : '#475569',
                boxShadow: activeTab === 'negative' ? '0 4px 12px rgba(244, 63, 94, 0.3)' : 'none',
                fontWeight: 700
              }}
            >
              <AlertCircle size={14} /> Issue Tags (1-3 Stars)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
              Highlights ({currentList.length}/15)
            </span>
            <button
              type="button"
              className="btn-primary-action"
              style={{ width: 'auto', padding: '0.55rem 1.15rem', fontSize: '0.85rem', minHeight: '38px' }}
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            >
              <Plus size={16} /> {isAddFormOpen ? 'Close Form' : `Add Highlight`}
            </button>
          </div>
        </div>

        {/* INLINE FORM TO ADD NEW HIGHLIGHT */}
        {isAddFormOpen && (
          <form
            onSubmit={handleAddSubmit}
            style={{
              background: '#ffffff',
              border: '2px solid #4f46e5',
              boxShadow: '0 10px 30px -5px rgba(79, 70, 229, 0.12)',
              padding: '1.25rem',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={16} color="#4f46e5" /> Add New {activeTab === 'positive' ? 'Positive Highlight' : 'Issue Tag'}
              </div>
              <button type="button" onClick={() => setIsAddFormOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Highlight Label & Emoji:</label>
                <input
                  type="text"
                  className="form-input"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. 😊 Friendly Staff or 🍕 Fresh Food"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Category:</label>
                <select
                  className="form-input"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>Auto-Written Review Sentence Snippet (Optional):</label>
              <input
                type="text"
                className="form-input"
                value={newSnippet}
                onChange={(e) => setNewSnippet(e.target.value)}
                placeholder="e.g. The staff were exceptionally warm, welcoming, and helpful."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn-secondary-action"
                style={{ width: 'auto', padding: '0.5rem 1rem' }}
                onClick={() => setIsAddFormOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary-action"
                style={{ width: 'auto', padding: '0.5rem 1.25rem' }}
              >
                <Check size={15} /> Save Highlight
              </button>
            </div>
          </form>
        )}

        {/* GRID OF INLINE EDITABLE HIGHLIGHT CHIPS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {currentList.map((tag, index) => {
            const tagId = tag.id || tag.tagId;
            const isEditing = editingTagId === tagId;

            return (
              <div
                key={tagId || index}
                style={{
                  background: '#ffffff',
                  border: isEditing ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.65rem',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {/* INLINE EDITABLE LABEL & CATEGORY */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', fontWeight: 800 }}
                          value={inlineLabel}
                          onChange={(e) => setInlineLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveInlineEdit(tag);
                            if (e.key === 'Escape') setEditingTagId(null);
                          }}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveInlineEdit(tag)}
                          style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', padding: '0.3rem 0.5rem', cursor: 'pointer' }}
                        >
                          <Check size={14} />
                        </button>
                      </div>
                      <select
                        className="form-input"
                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', fontWeight: 700 }}
                        value={inlineCategory}
                        onChange={(e) => setInlineCategory(e.target.value)}
                      >
                        {ALL_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleStartInlineEdit(tag)}
                      style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      title="Click to edit inline"
                    >
                      <span>{tag.label}</span>
                      <Edit2 size={12} color="#94a3b8" />
                    </div>
                  )}

                  {!isEditing && (
                    <span
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        background: '#e0e7ff',
                        color: '#4f46e5',
                        border: '1px solid #c7d2fe',
                        padding: '0.15rem 0.6rem',
                        borderRadius: '12px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tag.category || 'General'}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.825rem', color: '#475569', fontStyle: 'italic', lineHeight: '1.4', fontWeight: 500 }}>
                  "{tag.snippet || tag.label}"
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                  {/* Order buttons */}
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '0.25rem', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.4 : 1 }}
                      title="Move Up"
                    >
                      <ArrowUp size={14} color="#334155" />
                    </button>
                    <button
                      type="button"
                      disabled={index === currentList.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '0.25rem', cursor: index === currentList.length - 1 ? 'not-allowed' : 'pointer', opacity: index === currentList.length - 1 ? 0.4 : 1 }}
                      title="Move Down"
                    >
                      <ArrowDown size={14} color="#334155" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => handleStartInlineEdit(tag)}
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#2563eb',
                        borderRadius: '8px',
                        padding: '0.25rem 0.55rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      <Edit2 size={12} /> Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteKeyword(activeTab, tagId)}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fca5a5',
                        color: '#ef4444',
                        borderRadius: '8px',
                        padding: '0.25rem 0.55rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIVE INTERACTIVE GUEST PAGE PREVIEW & REVIEW STRENGTH METER */}
      <div className="chart-card" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', border: '1.5px solid #d8b4fe' }}>
        <div className="chart-title" style={{ color: '#7e22ce' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Smartphone size={20} color="#7e22ce" /> Customer Experience & AI Review Strength Simulator
          </span>
          <span style={{ fontSize: '0.75rem', background: '#7e22ce', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
            Interactive
          </span>
        </div>

        {/* LIVE REVIEW STRENGTH METRICS PANEL */}
        <div style={{ background: '#ffffff', border: '1px solid #e9d5ff', borderRadius: '16px', padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#6b21a8', textTransform: 'uppercase' }}>Review Strength</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'center' }}>
              <Star size={16} color="#f59e0b" fill="#f59e0b" /> {reviewMetrics.stars}/5
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#6b21a8', textTransform: 'uppercase' }}>SEO Quality</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#059669' }}>
              {reviewMetrics.status}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#6b21a8', textTransform: 'uppercase' }}>Length</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1e293b' }}>
              {reviewMetrics.lengthCategory} ({reviewMetrics.wordCount} words)
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#6b21a8', textTransform: 'uppercase' }}>Uniqueness</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#4f46e5' }}>
              {reviewMetrics.uniqueness}
            </div>
          </div>
        </div>

        {/* PHONE PREVIEW MOCKUP */}
        <div style={{ maxWidth: '380px', margin: '0 auto', background: '#ffffff', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 12px 30px rgba(126, 34, 206, 0.15)', border: '1px solid #e9d5ff', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
            {settings.hotelName || 'Sree Jee Stay'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, margin: '0 0 1rem' }}>
            What did you enjoy most?
          </p>

          {/* CHIPS SELECTOR PREVIEW */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
            {currentList.map((tag) => {
              const tagId = tag.id || tag.tagId;
              const isSelected = previewSelectedTags.includes(tagId);
              return (
                <button
                  key={tagId}
                  type="button"
                  onClick={() => togglePreviewTag(tagId)}
                  style={{
                    fontSize: '0.775rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '20px',
                    border: isSelected ? '1.5px solid #7e22ce' : '1px solid #cbd5e1',
                    background: isSelected ? '#f3e8ff' : '#f8fafc',
                    color: isSelected ? '#7e22ce' : '#334155',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tag.label} {isSelected && '✓'}
                </button>
              );
            })}
          </div>

          {/* DYNAMIC GENERATED REVIEW TEXT DISPLAY */}
          <div style={{ background: '#f8fafc', border: '1px dashed #c084fc', borderRadius: '14px', padding: '0.85rem', textAlign: 'left' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#7e22ce', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Generated Review Suggestion:
            </div>
            <div style={{ fontSize: '0.825rem', color: '#1e293b', lineHeight: '1.4', fontStyle: 'italic' }}>
              "{generatedPreviewText}"
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED PREVIEW CUSTOMER EXPERIENCE MODAL */}
      {previewModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '440px', padding: '2rem 1.5rem', textAlign: 'center', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Smartphone size={16} /> Mobile Customer Experience Preview
              </span>
              <button type="button" onClick={() => setPreviewModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
              {settings.hotelName || 'Sree Jee Stay'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.25rem' }}>
              Loved your experience? We'd appreciate your feedback!
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={32} color="#f59e0b" fill="#f59e0b" />
              ))}
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.65rem' }}>
              What did you enjoy most?
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
              {currentList.map((tag) => {
                const tagId = tag.id || tag.tagId;
                const isSelected = previewSelectedTags.includes(tagId);
                return (
                  <button
                    key={tagId}
                    type="button"
                    onClick={() => togglePreviewTag(tagId)}
                    style={{
                      fontSize: '0.775rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '20px',
                      border: isSelected ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                      background: isSelected ? '#eff6ff' : '#f8fafc',
                      color: isSelected ? '#2563eb' : '#334155',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                    }}
                  >
                    {tag.label} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem', textAlign: 'left', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.4rem' }}>
                Auto-Written Google Review:
              </div>
              <div style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: '1.4', fontStyle: 'italic' }}>
                "{generatedPreviewText}"
              </div>
            </div>

            <button
              type="button"
              className="btn-primary-action"
              onClick={() => setPreviewModalOpen(false)}
            >
              Close Simulator
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR APPLYING TEMPLATES */}
      {templateModalOpen && selectedTemplateKey && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              {getTemplateIconComponent(selectedTemplateKey)}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
              Load {INDUSTRY_TEMPLATES[selectedTemplateKey]?.name} Preset?
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.4', margin: '0 0 1.25rem' }}>
              This will pre-populate 8 optimized highlights tailored for <strong>{INDUSTRY_TEMPLATES[selectedTemplateKey]?.name}</strong>. You can customize them anytime!
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setTemplateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary-action"
                onClick={confirmApplyTemplate}
              >
                <Sparkles size={16} /> Apply Preset Highlights
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
