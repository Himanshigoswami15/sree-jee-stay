import React, { useState, useEffect } from 'react';
import { QrCode, Download, Printer, Copy, Check, ExternalLink, Sparkles, RefreshCw, BarChart3, Smartphone, Clock, Globe } from 'lucide-react';
import QRCode from 'qrcode';
import { useFeedback } from '../../context/FeedbackContext';
import { apiClient } from '../../services/apiClient';

export function QrStudio() {
  const { settings } = useFeedback();

  const [qrToken, setQrToken] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [pngUrl, setPngUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const [scansCount, setScansCount] = useState(0);

  const [analytics, setAnalytics] = useState({
    totalScans: 0,
    todayScans: 0,
    googleRedirects: 0,
    tripadvisorRedirects: 0,
    facebookRedirects: 0,
    internalFeedback: 0,
    conversionRate: 0,
    topScanTime: '7 PM',
  });

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [targetMode, setTargetMode] = useState('live'); // 'live' | 'local'

  const hotelSlug = settings?.hotelSlug || 'sree-jee-stay';
  const hotelName = settings?.hotelName || 'Sree Jee Stay';

  const [customIpUrl, setCustomIpUrl] = useState('');

  const fetchQrAndAnalytics = async (overrideMode = targetMode, customUrlOverride = '') => {
    let redirectUrl = `https://sree-jee-stay.vercel.app/${hotelSlug}`;

    if (customUrlOverride) {
      redirectUrl = customUrlOverride.endsWith(`/${hotelSlug}`) ? customUrlOverride : `${customUrlOverride.replace(/\/$/, '')}/${hotelSlug}`;
    } else if (overrideMode === 'local' && typeof window !== 'undefined') {
      // Use local origin (e.g. http://192.168.x.x:7890 or http://localhost:7890)
      redirectUrl = `${window.location.origin}/${hotelSlug}`;
    }

    setTargetUrl(redirectUrl);

    try {
      // Instant, guaranteed client-side QR code generation
      const dataUrl = await QRCode.toDataURL(redirectUrl, {
        width: 320,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      });
      setPngUrl(dataUrl);

      const svg = await QRCode.toString(redirectUrl, {
        type: 'svg',
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      });
      setSvgString(svg);
    } catch (e) {
      console.warn('[QrStudio] Client-side QR generation error:', e);
    }

    try {
      // Fetch optional server-side token & analytics data
      const qrRes = await apiClient('/api/review/generate-qr', {
        method: 'POST',
        body: JSON.stringify({ hotelSlug }),
      });

      if (qrRes?.success) {
        if (qrRes.qrToken) setQrToken(qrRes.qrToken);
        if (qrRes.scansCount !== undefined) setScansCount(qrRes.scansCount);
      }

      const analyticsRes = await apiClient(`/api/review/analytics?hotelSlug=${encodeURIComponent(hotelSlug)}`);
      if (analyticsRes?.success && analyticsRes.analytics) {
        setAnalytics(analyticsRes.analytics);
      }
    } catch (err) {
      console.warn('[QrStudio] Error fetching analytics:', err);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  useEffect(() => {
    fetchQrAndAnalytics();
  }, [hotelSlug]);

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
    } else {
      const link = document.createElement('a');
      link.href = `/api/review/download/png?hotelSlug=${encodeURIComponent(hotelSlug)}`;
      link.download = `${hotelSlug}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadPdf = () => {
    const link = document.createElement('a');
    link.href = `/api/review/download/pdf?hotelSlug=${encodeURIComponent(hotelSlug)}`;
    link.download = `${hotelSlug}-tent-card.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <div className="dashboard-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* SECTION TITLE */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            JJ Review System — Enterprise QR Studio
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {hotelName} Review QR Code & Analytics
          </h2>
        </div>
        <button
          type="button"
          className="btn-secondary-action"
          onClick={() => {
            setRegenerating(true);
            fetchQrAndAnalytics();
          }}
          disabled={regenerating}
          style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
        >
          <RefreshCw size={14} className={regenerating ? 'spin' : ''} /> Refresh Data
        </button>
      </div>

      {/* SCAN ANALYTICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>
            <Smartphone size={16} color="#2563eb" /> Total Scans
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
            {analytics.totalScans || scansCount || 0}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#059669', marginTop: '2px', fontWeight: 600 }}>
            Today's Scans: <strong>{analytics.todayScans || 0}</strong>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>
            <Globe size={16} color="#059669" /> Google Redirects
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem' }}>
            {analytics.googleRedirects || 0}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '2px' }}>
            TripAdvisor: {analytics.tripadvisorRedirects || 0} | FB: {analytics.facebookRedirects || 0}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>
            <BarChart3 size={16} color="#4f46e5" /> Conversion Rate
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4f46e5', marginTop: '0.35rem' }}>
            {analytics.conversionRate || 0}%
          </div>
          <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '2px' }}>
            Internal Feedback: {analytics.internalFeedback || 0}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>
            <Clock size={16} color="#d97706" /> Top Scan Time
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', marginTop: '0.35rem' }}>
            {analytics.topScanTime || '7 PM'}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '2px' }}>
            Peak customer activity window
          </div>
        </div>
      </div>

      {/* QR STUDIO CONTENT GRID */}
      <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
        {/* RECEPTION STANDEE & TENT CARD PREVIEW */}
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
          <div className="chart-title" style={{ justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a' }}>
              <Printer size={20} color="#16a34a" /> Reception Standee & Tent Card
            </span>
          </div>

          {/* Target Domain Selector Bar */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Globe size={15} color="#2563eb" /> Target QR Destination Mode:
              </span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setTargetMode('live');
                    fetchQrAndAnalytics('live');
                  }}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: targetMode === 'live' ? 800 : 600,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '16px',
                    border: targetMode === 'live' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                    background: targetMode === 'live' ? '#eff6ff' : '#ffffff',
                    color: targetMode === 'live' ? '#2563eb' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  🌐 Live Vercel URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetMode('local');
                    fetchQrAndAnalytics('local');
                  }}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: targetMode === 'local' ? 800 : 600,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '16px',
                    border: targetMode === 'local' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                    background: targetMode === 'local' ? '#eff6ff' : '#ffffff',
                    color: targetMode === 'local' ? '#2563eb' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  💻 Local Wi-Fi / Dev
                </button>
              </div>
            </div>

            {/* Mobile Scan Troubleshooting Guide Banner */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.65rem 0.85rem', textAlign: 'left', fontSize: '0.775rem', color: '#1e3a8a', lineHeight: '1.4' }}>
              <strong>📱 Why phone shows old data when scanning QR code:</strong>
              <ul style={{ margin: '0.35rem 0 0 1.1rem', padding: 0 }}>
                <li><strong>Live Vercel QR Mode:</strong> Scans `https://sree-jee-stay.vercel.app`. Mobile phone will show old code until you deploy/push your new code to Vercel!</li>
                <li><strong>Local Dev Wi-Fi Mode:</strong> `localhost` won't work on mobile phones. Both your computer and phone must be on the same Wi-Fi network using your PC's IP address (e.g. <code>http://192.168.x.x:7890</code>).</li>
              </ul>
            </div>
          </div>

          {/* Printable Tent Card Mockup Frame */}
          <div style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', border: '2px solid #2563eb', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.08)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
              ⭐ Love your experience?
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {hotelName}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '4px', fontWeight: 800 }}>
              Scan to leave a Google Review
            </div>

            {pngUrl && (
              <img
                src={pngUrl}
                alt="QR Code"
                style={{ width: '170px', height: '170px', margin: '0.85rem auto', display: 'block', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            )}

            <div style={{ fontSize: '1.1rem', letterSpacing: '2px', marginBottom: '0.4rem' }}>
              ⭐⭐⭐⭐⭐
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '0.35rem 0.65rem', borderRadius: '8px', display: 'inline-block' }}>
              1. Scan QR  →  2. Tap Highlights  →  3. Post to Google
            </div>
          </div>

          {/* Target Link & Copy Bar */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.35rem 0.65rem', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {targetUrl || `${window.location.origin}/${hotelSlug}`}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Multi-Format Export Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={handleDownloadPng}
              style={{ fontSize: '0.75rem', padding: '0.5rem', justifyContent: 'center' }}
            >
              <Download size={13} /> PNG
            </button>

            <button
              type="button"
              className="btn-secondary-action"
              onClick={handleDownloadSvg}
              style={{ fontSize: '0.75rem', padding: '0.5rem', justifyContent: 'center' }}
            >
              <Download size={13} /> SVG
            </button>

            <button
              type="button"
              className="btn-primary-action"
              onClick={handleDownloadPdf}
              style={{ fontSize: '0.75rem', padding: '0.5rem', justifyContent: 'center' }}
            >
              <Printer size={13} /> PDF Tent Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
