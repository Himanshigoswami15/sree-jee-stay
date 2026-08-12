import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  BarChart3,
  Smartphone,
  Globe,
  Building2,
  Plus,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link2
} from 'lucide-react';
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
  const [portalOpened, setPortalOpened] = useState(false);

  const [analytics, setAnalytics] = useState({
    totalScans: 0,
    todayScans: 0,
    googleRedirects: 0,
    conversionRate: 0,
  });

  const hotelSlug = settings?.hotelSlug || '';
  const hotelName = settings?.hotelName || settings?.name || 'Registered Property';
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
        width: 380,
        margin: 2,
        color: { dark: '#0F172A', light: '#FFFFFF' },
      });
      setPngUrl(dataUrl);

      const svg = await QRCode.toString(finalQrUrl, {
        type: 'svg',
        margin: 2,
        color: { dark: '#0F172A', light: '#FFFFFF' },
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

      if (qrRes?.success && qrRes.scansCount !== undefined) {
        setScansCount(qrRes.scansCount);
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

  const handlePasteReviewUrl = (e) => {
    const pastedText = e.clipboardData?.getData('text') || '';
    if (!pastedText.trim()) return;

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
        setTimeout(() => setPortalOpened(false), 3500);
      }
    }, 100);
  };

  const handleOpenPortalPreview = () => {
    const url = inputReviewUrl.trim() || activeReviewUrl;
    if (!url) return;
    const extractedId = extractPlaceId(url);
    const openUrl = extractedId
      ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(extractedId)}`
      : url;
    window.open(openUrl, '_blank', 'noopener,noreferrer');
    setPortalOpened(true);
    setTimeout(() => setPortalOpened(false), 3500);
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
      setTimeout(() => setLinkSaved(false), 2200);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Action Bar */}
      <div className="saas-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <QrCode size={20} color="var(--slate-900)" />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
                {hotelName} QR Studio & Link Hub
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                Direct review link routing, live printable tent cards & QR analytics
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="saas-btn saas-btn-primary"
              onClick={() => setIsRegistryOpen(true)}
              style={{ fontSize: '0.8125rem', height: '36px' }}
            >
              <Plus size={14} />
              <span>Onboard Property</span>
            </button>

            <button
              type="button"
              className="saas-btn saas-btn-secondary"
              onClick={fetchAnalytics}
              style={{ fontSize: '0.8125rem', height: '36px' }}
            >
              <RefreshCw size={13} />
              <span>Refresh Stats</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">
            <span>Total QR Scans</span>
            <Smartphone size={15} color="var(--slate-400)" />
          </div>
          <div className="kpi-value">{analytics.totalScans || scansCount || 0}</div>
          <div className="kpi-subtext">
            Today: <strong>{analytics.todayScans || 0} scans</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">
            <span>Google Review Clicks</span>
            <Globe size={15} color="var(--emerald-600)" />
          </div>
          <div className="kpi-value" style={{ color: 'var(--emerald-600)' }}>
            {analytics.googleRedirects || 0}
          </div>
          <div className="kpi-subtext">High-intent guest conversions</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">
            <span>Total Reviews Logged</span>
            <BarChart3 size={15} color="var(--brand-accent)" />
          </div>
          <div className="kpi-value">{(feedbacks || []).length}</div>
          <div className="kpi-subtext">Across all star ratings</div>
        </div>
      </div>

      {/* Main Grid: Review Link Form & Live Tent Card Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Link Configuration Card */}
        <div className="saas-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Link2 size={18} color="var(--slate-900)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
              Destination Google Review Link
            </h3>
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
            Paste your Google Business review link, Google Maps URL, or Place ID. The system validates it in real time and routes guests directly to the 5-star Write Review popup.
          </p>

          {linkSaved && (
            <div className="saas-badge saas-badge-success" style={{ width: '100%', padding: '0.5rem 0.75rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={14} /> Review link updated successfully!
            </div>
          )}

          {portalOpened && (
            <div className="saas-badge saas-badge-accent" style={{ width: '100%', padding: '0.5rem 0.75rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)' }}>
              <ExternalLink size={14} /> Opened review destination in a new tab for testing.
            </div>
          )}

          <form onSubmit={handleSaveReviewLink} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label className="saas-label" style={{ marginBottom: '0.35rem' }}>
                Review Link or Place ID:
              </label>
              <input
                type="text"
                className="saas-input"
                value={inputReviewUrl}
                onChange={(e) => setInputReviewUrl(e.target.value)}
                onPaste={handlePasteReviewUrl}
                placeholder="https://g.page/r/... or Place ID (ChIJ...)"
                required
              />
            </div>

            {validation && (
              <div
                className={`saas-badge ${validation.isValid ? 'saas-badge-success' : 'saas-badge-warning'}`}
                style={{ borderRadius: 'var(--radius-md)', padding: '0.45rem 0.75rem', width: '100%' }}
              >
                {validation.isValid ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                <span>{validation.message}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button
                type="submit"
                className="saas-btn saas-btn-primary"
                disabled={isSavingLink}
                style={{ flex: 1, height: '40px' }}
              >
                <Save size={14} />
                <span>{isSavingLink ? 'Saving...' : 'Save & Update QR'}</span>
              </button>

              {(inputReviewUrl || activeReviewUrl) && (
                <button
                  type="button"
                  onClick={handleOpenPortalPreview}
                  className="saas-btn saas-btn-secondary"
                  style={{ height: '40px' }}
                  title="Test Destination Link"
                >
                  <ExternalLink size={14} />
                  <span>Test Link</span>
                </button>
              )}
            </div>
          </form>

          <div style={{ borderTop: '1px solid var(--slate-200)', marginTop: '1.25rem', paddingTop: '1.25rem' }}>
            <label className="saas-label" style={{ marginBottom: '0.35rem' }}>
              Direct Guest URL:
            </label>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <input
                type="text"
                readOnly
                className="saas-input"
                value={targetUrl}
                style={{ background: 'var(--slate-50)', color: 'var(--slate-600)', fontSize: '0.75rem' }}
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="saas-btn saas-btn-secondary"
                style={{ padding: '0 0.75rem', height: '42px' }}
              >
                {copied ? <Check size={14} color="var(--emerald-600)" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Printable Tent Card Preview */}
        <div className="saas-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Printer size={18} color="var(--slate-900)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
              Reception Tent Card & QR Preview
            </h3>
          </div>

          {/* Card Frame */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--slate-200)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 1.25rem',
              boxShadow: 'var(--shadow-md)',
              maxWidth: '320px',
              margin: '0 auto 1.25rem',
            }}
          >
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--gold-600)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
              We Value Your Experience
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
              {hotelName}
            </div>

            {pngUrl ? (
              <img
                src={pngUrl}
                alt={`${hotelName} QR Code`}
                style={{
                  width: '180px',
                  height: '180px',
                  margin: '0 auto 0.75rem',
                  display: 'block',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-200)',
                  padding: '4px',
                }}
              />
            ) : (
              <div style={{ width: '180px', height: '180px', margin: '0 auto', background: 'var(--slate-100)', borderRadius: 'var(--radius-md)' }} />
            )}

            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '0.25rem' }}>
              Scan QR to Leave a Review
            </div>

            <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>
              Takes under 30 seconds · No app required
            </div>
          </div>

          {/* Download Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="saas-btn saas-btn-secondary"
              onClick={handleDownloadPng}
              style={{ fontSize: '0.75rem', height: '36px' }}
            >
              <Download size={13} />
              <span>PNG</span>
            </button>

            <button
              type="button"
              className="saas-btn saas-btn-secondary"
              onClick={handleDownloadSvg}
              style={{ fontSize: '0.75rem', height: '36px' }}
            >
              <Download size={13} />
              <span>SVG</span>
            </button>

            <button
              type="button"
              className="saas-btn saas-btn-primary"
              onClick={handleDownloadPdf}
              style={{ fontSize: '0.75rem', height: '36px' }}
            >
              <Printer size={13} />
              <span>PDF Card</span>
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
