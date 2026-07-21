import React, { useState } from 'react';
import { Tag, Plus, Trash2, Sparkles, Check, ThumbsUp, AlertCircle } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

export function KeywordStudio() {
  const { keywords, addKeyword, deleteKeyword } = useFeedback();
  const [activeTab, setActiveTab] = useState('positive'); // 'positive' | 'negative'
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('Service');
  const [snippet, setSnippet] = useState('');

  const currentList = activeTab === 'positive' ? (keywords.positive || []) : (keywords.negative || []);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;

    addKeyword(activeTab, {
      label: label.trim(),
      category: category.trim() || 'General',
      snippet: snippet.trim() || label.trim(),
    });

    // Reset Form
    setLabel('');
    setCategory('Service');
    setSnippet('');
    setIsFormOpen(false);
  };

  return (
    <div className="chart-card">
      <div className="chart-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <Tag size={20} /> Keyword & Sentiment Tag Studio
        </span>
        <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Sparkles size={12} /> Live Sync with Guest Flow
        </span>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
        Manage the tap-able keyword chips offered to guests and configure the auto-written sentence snippets generated for public reviews or internal alerts.
      </p>

      {/* Type Switcher & Add Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="nav-tabs" style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'positive' ? 'active' : ''}`}
            onClick={() => setActiveTab('positive')}
            style={{ background: activeTab === 'positive' ? '#10b981' : 'transparent', color: activeTab === 'positive' ? 'white' : 'var(--text-muted)' }}
          >
            <ThumbsUp size={14} /> Positive Highlights (4-5 Stars)
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'negative' ? 'active' : ''}`}
            onClick={() => setActiveTab('negative')}
            style={{ background: activeTab === 'negative' ? '#f43f5e' : 'transparent', color: activeTab === 'negative' ? 'white' : 'var(--text-muted)' }}
          >
            <AlertCircle size={14} /> Issue Tags (1-3 Stars)
          </button>
        </div>

        <button
          type="button"
          className="btn-primary-action"
          style={{ width: 'auto', padding: '0.55rem 1.15rem', fontSize: '0.85rem', minHeight: '38px' }}
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <Plus size={16} /> {isFormOpen ? 'Close Form' : `Add New ${activeTab === 'positive' ? 'Highlight' : 'Issue'} Tag`}
        </button>
      </div>

      {/* Inline Form to Add Tag */}
      {isFormOpen && (
        <form
          onSubmit={handleAddSubmit}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid var(--primary-light)',
            padding: '1.25rem',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
            Add New {activeTab === 'positive' ? 'Positive Highlight' : 'Issue Tag'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Chip Label (with Emoji):</label>
              <input
                type="text"
                className="form-input"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. 🍸 Craft Cocktails or 🚗 Valet Delay"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category:</label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Service">Service</option>
                <option value="Amenities">Amenities</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Dining">Dining</option>
                <option value="Comfort">Comfort</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Auto-Written Review Sentence Snippet:</label>
            <input
              type="text"
              className="form-input"
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              placeholder="e.g. The craft cocktails at the bar were exceptional."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary-action"
              style={{ width: 'auto', padding: '0.5rem 1rem' }}
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-action"
              style={{ width: 'auto', padding: '0.5rem 1.25rem' }}
            >
              <Check size={15} /> Save Keyword Tag
            </button>
          </div>
        </form>
      )}

      {/* Grid of Keywords */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {currentList.map((tag) => (
          <div
            key={tag.id}
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--bg-card-border)',
              borderRadius: '14px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              gap: '0.65rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {tag.label}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '10px',
                  color: 'var(--text-muted)',
                }}
              >
                {tag.category}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.35' }}>
              "{tag.snippet || tag.label}"
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => deleteKeyword(activeTab, tag.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fb7185',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <Trash2 size={13} /> Delete Tag
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
