import React, { useState, useEffect } from 'react';
import { QrCode, Download, Printer, Copy, Check, ExternalLink, RefreshCw, BarChart3, Smartphone, Globe, Building2, Plus, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { useFeedback } from '../../context/FeedbackContext';
import { apiClient } from '../../services/apiClient';
import { validateGoogleReviewLink, extractPlaceId } from '../../utils/googleReview';
import { HotelRegistryModal } from './HotelRegistryModal';
import { useNavigate } from 'react-router-dom';

export function QrStudio() {
  const navigate = useNavigate();
  const { settings, updateSettings, refreshHotels, feedbacks } = useFeedback();

  const [inputReviewUrl, setInputReviewUrl] = useState('');

  const [targetUrl, setTargetUrl] = useState('');
  const [pngUrl, setPngUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const [copied, setCopied] = useState(false);
  const [linkSaved, setLinkSaved] = useState(false);
  const [isSavingLink, setIsSavingLink] = useState(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [scansCount, setScansCount] = useState(0);
  const [portalOpened, setPortalOpened] = useState(false); // toast when portal auto-opens

  const [analytics, setAnalytics] = useState({
    totalScans: 0,
    todayScans: 0,
    googleRedirects: 0,
    conversionRate: 0,
  });

  const hotelSlug = settings?.hotelSlug || '';
  const hotelName = settings?.hotelName || settings?.name || 'Registered Hotel';
  const activeReviewUrl = settings?.googleReviewUrl || '';

  useEffect(() => {
    setInputReviewUrl(settings?.googleReviewUrl || '');
  }, [settings?.googleReviewUrl]);

  const validation = validateGoogleReviewLink(inputReviewUrl || activeReviewUrl);

  const generateQrCode = async () => {
    const currentOrigin = (typeof window !== 'undefined' && window.location.origin)
      ? window.location.origin
      : 'https://jj-elevates.vercel.app';

    const finalQrUrl = `${currentOrigin}/r/${hotelSlug}`;
    setTargetUrl(finalQrUrl);

    try {
      const dataUrl = await QRCode.toDataURL(finalQrUrl, {
        width: 360,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      });
      setPngUrl(dataUrl);

      const svg = await QRCode.toString(finalQrUrl, {
        type: 'svg',
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      });
      setSvgString(svg);
    } catch (e) {
      console.warn('[QrStudio] QR generation error:', e);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const qrRes = await apiClient('/api/review/generate-qr', {
        method: 'POST',
        body: JSON.stringify({ hotelSlug }),
      });

      if (qrRes?.success) {
        if (qrRes.scansCount !== undefined) setScansCount(qrRes.scansCount);
      }

      const analyticsRes = await apiClient(`/api/review/analytics?hotelSlug=${encodeURIComponent(hotelSlug)}`);
      if (analyticsRes?.success && analyticsRes.analytics) {
        setAnalytics(analyticsRes.analytics);
      }
    } catch (err) {
      console.warn('[QrStudio] Analytics fetch error:', err);
    }
  };

  useEffect(() => {
    generateQrCode();
    fetchAnalytics();
  }, [hotelSlug, activeReviewUrl]);

  // Auto-open review portal when a valid URL is pasted
  const handlePasteReviewUrl = (e) => {
    const pastedText = e.clipboardData?.getData('text') || '';
    if (!pastedText.trim()) return;

    // Use setTimeout so state updates first
    setTimeout(() => {
      const trimmed = pastedText.trim();
      const isUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://');
      const extractedId = extractPlaceId(trimmed);
      const openUrl = extractedId
        ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(extractedId)}`
        : isUrl ? trimmed : null;

      if (openUrl) {
        window.open(openUrl, '_blank', 'noopener,noreferrer');
        setPortalOpened(true);
        setTimeout(() => setPortalOpened(false), 4000);
      }
    }, 100);
  };

  // Manually test/open the current review portal
  const handleOpenPortalPreview = () => {
    const url = inputReviewUrl.trim() || activeReviewUrl;
    if (!url) return;
    const extractedId = extractPlaceId(url);
    const openUrl = extractedId
      ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(extractedId)}`
      : url;
    window.open(openUrl, '_blank', 'noopener,noreferrer');
    setPortalOpened(true);
    setTimeout(() => setPortalOpened(false), 4000);
  };

  const handleSaveReviewLink = async (e) => {
    if (e) e.preventDefault();
    if (!inputReviewUrl.trim()) return;

    setIsSavingLink(true);
    const cleanUrl = inputReviewUrl.trim();
    const extractedId = extractPlaceId(cleanUrl);
    const generatedUrl = extractedId ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(extractedId)}` : cleanUrl;

    const payload = {
      googleReviewUrl: generatedUrl,
      googlePlaceId: extractedId || settings.googlePlaceId || '',
    };

    const res = await updateSettings(payload);
    setIsSavingLink(false);

    if (res?.success) {
      setLinkSaved(true);
      setTimeout(() => setLinkSaved(false), 2500);
      generateQrCode();
    }
  };

  const handleCopyLink = () => {
    if (!targetUrl) return;
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (pngUrl) {
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${hotelSlug}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${hotelSlug}-qr-code.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    const link = document.createElement('a');
    link.href = `/api/review/download/pdf?hotelSlug=${encodeURIComponent(hotelSlug)}`;
    link.download = `${hotelSlug}-tent-card.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* TOP HEADER & HOTEL/COMPANY SWITCHER */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
              🎯 Multi-Business QR Studio & Review Link Hub
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={24} color="#2563eb" />
              <span>{hotelName} Unique QR Code</span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-primary-action"
              onClick={() => setIsRegistryOpen(true)}
              style={{ fontSize: '0.825rem', padding: '0.5rem 0.95rem' }}
            >
              <Plus size={16} /> Add New Hotel / Company
            </button>

            <button
              type="button"
              className="btn-secondary-action"
              onClick={fetchAnalytics}
              style={{ fontSize: '0.825rem', padding: '0.5rem 0.85rem' }}
            >
              <RefreshCw size={14} /> Refresh Stats
            </button>
          </div>
        </div>
      </div>

      {/* CLEAN ESSENTIAL STATS BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>
            <Smartphone size={16} color="#2563eb" /> Total QR Scans
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
            {analytics.totalScans || scansCount || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px', fontWeight: 600 }}>
            Scans Today: <strong>{analytics.todayScans || 0}</strong>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>
            <Globe size={16} color="#059669" /> Direct Review Clicks
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem' }}>
            {analytics.googleRedirects || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Confirmed 5-Star Conversions
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.1rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>
            <BarChart3 size={16} color="#4f46e5" /> Total Feedbacks
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#4f46e5', marginTop: '0.35rem' }}>
            {(feedbacks || []).length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Submitted by Guests
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER: UPSIDE REVIEW LINK EDITOR + LIVE POSTER & QR */}
      <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* UPSIDE REVIEW LINK INPUT CARD */}
        <div className="chart-card" style={{ background: '#ffffff', border: '2px solid #3b82f6', borderRadius: '18px', padding: '1.35rem', boxShadow: '0 6px 20px rgba(59, 130, 246, 0.08)' }}>
          <div className="chart-title" style={{ marginBottom: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1d4ed8', fontWeight: 800, fontSize: '1.05rem' }}>
              <Globe size={20} color="#2563eb" /> 1. Paste Proper Review Site Link (Upside of QR Code)
            </span>
          </div>

          <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.45', marginBottom: '1rem' }}>
            Paste your Google Business review link, Google Maps link, TripAdvisor link, or Place ID below. The system immediately binds it to <strong>{hotelName}</strong> and updates your unique QR code!
          </p>

          {/* Auto-Open Portal Toast */}
          {portalOpened && (
            <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1.5px solid #93c5fd', color: '#1d4ed8', padding: '0.8rem 1rem', borderRadius: '12px', marginBottom: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(37,99,235,0.12)', animation: 'fadeIn 0.3s ease' }}>
              <ExternalLink size={18} color="#2563eb" />
              <span>✅ Review portal opened in a new tab! Guests will land directly on the review page.</span>
            </div>
          )}

          {linkSaved && (
            <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}>
              <CheckCircle2 size={18} color="#059669" /> Review link saved & QR code updated for {hotelName}!
            </div>
          )}

          <form onSubmit={handleSaveReviewLink} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <input
                type="text"
                className="form-input"
                value={inputReviewUrl}
                onChange={(e) => setInputReviewUrl(e.target.value)}
                onPaste={handlePasteReviewUrl}
                placeholder="Paste Google review link / TripAdvisor link / Place ID here — auto-opens portal!"
                style={{ flex: 1, fontWeight: 600, fontSize: '0.875rem' }}
                required
              />
              <button
                type="submit"
                className="btn-primary-action"
                disabled={isSavingLink}
                style={{ width: 'auto', padding: '0.65rem 1.15rem', whiteSpace: 'nowrap' }}
              >
                <Save size={16} /> {isSavingLink ? 'Saving...' : 'Save & Update QR'}
              </button>
            </div>

            {/* Action Row: Validation + Open Portal Button */}
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Dynamic Link Status Indicator */}
              {validation && (
                <div style={{ flex: 1, fontSize: '0.775rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', color: validation.isValid ? '#15803d' : '#b45309', background: validation.isValid ? '#f0fdf4' : '#fffbeb', padding: '0.5rem 0.75rem', borderRadius: '8px', border: validation.isValid ? '1px solid #bbf7d0' : '1px solid #fef3c7' }}>
                  {validation.isValid ? <CheckCircle2 size={14} color="#16a34a" /> : <AlertCircle size={14} color="#d97706" />}
                  <span>{validation.message}</span>
                </div>
              )}

              {/* Open Review Portal Preview Button */}
              {(inputReviewUrl || activeReviewUrl) && (
                <button
                  type="button"
                  onClick={handleOpenPortalPreview}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.55rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 3px 10px rgba(37, 99, 235, 0.25)',
                  }}
                >
                  <ExternalLink size={15} /> Open Review Portal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* QR MODE SELECTOR */}


        {/* PRINTABLE TENT CARD POSTER (UPSIDE DETAILS + UNIQUE QR CODE) */}
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
          <div className="chart-title" style={{ justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 800 }}>
              <Printer size={20} color="#16a34a" /> Reception Standee & Tent Poster Preview
            </span>
          </div>

          {/* Poster Frame */}
          <div style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', border: '2.5px solid #2563eb', borderRadius: '20px', padding: '1.75rem 1.5rem', textAlign: 'center', boxShadow: '0 8px 30px rgba(37, 99, 235, 0.12)' }}>
            
            {/* UPSIDE DETAILS: REVIEW LINK & HOTEL NAME */}
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              ⭐ Love your experience?
            </div>

            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              {hotelName}
            </div>

            {/* Upside Review Link Display Box */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.4rem 0.85rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.65rem', marginBottom: '0.85rem', maxWidth: '90%' }}>
              <Globe size={14} color="#2563eb" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#1d4ed8', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                Review Link: {inputReviewUrl || activeReviewUrl}
              </span>
              <a
                href={inputReviewUrl || activeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#2563eb', flexShrink: 0 }}
                title="Test Link"
              >
                <ExternalLink size={13} />
              </a>
            </div>

            <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: 800 }}>
              Scan QR to leave a Google Review
            </div>

            {/* Crisp QR Code */}
            {pngUrl && (
              <img
                src={pngUrl}
                alt={`${hotelName} QR Code`}
                style={{ width: '190px', height: '190px', margin: '0.85rem auto', display: 'block', borderRadius: '12px', border: '2px solid #e2e8f0', background: '#ffffff', padding: '6px' }}
              />
            )}

            <div style={{ fontSize: '1.2rem', letterSpacing: '3px', marginBottom: '0.5rem' }}>
              ⭐⭐⭐⭐⭐
            </div>

            <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '0.4rem 0.85rem', borderRadius: '10px', display: 'inline-block' }}>
              1. Scan QR  →  2. Tap Highlights  →  3. Post Review
            </div>
          </div>

          {/* TARGET QR LINK DISPLAY & COPY BAR */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.45rem 0.75rem', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.775rem', color: '#475569', fontWeight: 700, flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {targetUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.775rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          {/* DOWNLOAD BUTTONS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem' }}>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={handleDownloadPng}
              style={{ fontSize: '0.775rem', padding: '0.6rem', justifyContent: 'center' }}
            >
              <Download size={14} /> Download PNG
            </button>

            <button
              type="button"
              className="btn-secondary-action"
              onClick={handleDownloadSvg}
              style={{ fontSize: '0.775rem', padding: '0.6rem', justifyContent: 'center' }}
            >
              <Download size={14} /> Download SVG
            </button>

            <button
              type="button"
              className="btn-primary-action"
              onClick={handleDownloadPdf}
              style={{ fontSize: '0.775rem', padding: '0.6rem', justifyContent: 'center' }}
            >
              <Printer size={14} /> PDF Tent Card
            </button>
          </div>
        </div>
      </div>

      <HotelRegistryModal
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
        onHotelOnboarded={(slug) => navigate(`/${slug}`)}
      />
    </div>
  );
}

