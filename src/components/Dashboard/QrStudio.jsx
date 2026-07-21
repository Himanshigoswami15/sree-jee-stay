import React, { useState, useEffect } from 'react';
import { QrCode, Download, Printer, ExternalLink, Sparkles, Building2 } from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qrHelper';
import { useFeedback } from '../../context/FeedbackContext';

export function QrStudio() {
  const { settings, setCurrentRoom } = useFeedback();
  const [selectedRoomInput, setSelectedRoomInput] = useState('Room 204');
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Target url to encode into QR code
  const targetUrl = `${window.location.origin}/review?room=${encodeURIComponent(selectedRoomInput)}`;

  useEffect(() => {
    generateQrDataUrl(targetUrl, { width: 300, darkColor: '#0f172a' }).then((url) => {
      if (url) setQrDataUrl(url);
    });
  }, [targetUrl]);

  const handleApplyToSimulator = () => {
    setCurrentRoom(selectedRoomInput);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_${selectedRoomInput.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  return (
    <div className="chart-card">
      <div className="chart-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8' }}>
          <QrCode size={20} /> Room & Table QR Studio
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Printable Tent Cards</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Enter Room Number or Table Tag:</label>
            <input
              type="text"
              className="form-input"
              value={selectedRoomInput}
              onChange={(e) => setSelectedRoomInput(e.target.value)}
              placeholder="e.g. Room 204 or Table 12"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Encoded Guest URL:</label>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(15, 23, 42, 0.8)', padding: '0.6rem', borderRadius: '8px', wordBreak: 'break-all', border: '1px solid var(--bg-card-border)' }}>
              {targetUrl}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary-action"
              style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}
              onClick={handleApplyToSimulator}
            >
              <ExternalLink size={15} /> Load in Guest Simulator
            </button>

            <button
              type="button"
              className="btn-secondary-action"
              style={{ padding: '0.75rem', fontSize: '0.85rem' }}
              onClick={handleDownloadQr}
            >
              <Download size={15} /> Download PNG
            </button>
          </div>
        </div>

        {/* Printable Tent Card Preview */}
        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
            color: '#0f172a',
            borderRadius: '20px',
            padding: '1.75rem',
            textAlign: 'center',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.85rem',
            border: '2px dashed #cbd5e1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569', fontSize: '0.8rem', fontWeight: 700, textTransform: uppercaseText() }}>
            <Building2 size={14} /> {settings.hotelName}
          </div>

          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            How was your stay in {selectedRoomInput}?
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Scan QR code with your camera to share feedback in 10 seconds!
          </div>

          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="QR Code"
              style={{ width: '170px', height: '170px', borderRadius: '12px', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          )}

          <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={12} color="#6366f1" /> Smart Review • Instant Duty Manager Help
          </div>
        </div>
      </div>
    </div>
  );
}

function uppercaseText() {
  return 'uppercase';
}
