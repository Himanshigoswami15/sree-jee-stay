import React, { useState } from 'react';
import { ShieldCheck, KeyRound, X, AlertCircle } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

export function ManagerPinModal() {
  const { isPinModalOpen, setIsPinModalOpen, verifyPin, settings } = useFeedback();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isPinModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = verifyPin(pinInput);
    if (success) {
      setPinInput('');
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect Security PIN. Please try again.');
      setPinInput('');
    }
  };

  const handleClose = () => {
    setIsPinModalOpen(false);
    setPinInput('');
    setErrorMsg('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '420px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '-0.5rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--primary), #4338ca)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <ShieldCheck size={28} />
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Manager Security Verification</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Please enter your 4-digit Manager PIN to access guest analytics & administration for <strong>{settings.hotelName}</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
          <div className="form-group">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem' }} />
              <input
                type="password"
                maxLength={8}
                className="form-input"
                style={{
                  paddingLeft: '2.75rem',
                  fontSize: '1.25rem',
                  letterSpacing: '0.35em',
                  textAlign: 'center',
                  fontWeight: 800,
                }}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="••••"
                autoFocus
                required
              />
            </div>
            {errorMsg && (
              <div style={{ fontSize: '0.8rem', color: '#fb7185', marginTop: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                <AlertCircle size={14} /> {errorMsg}
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Default Demo PIN: <strong style={{ color: '#a5b4fc' }}>1234</strong>
          </div>

          <button type="submit" className="btn-primary-action">
            Unlock Manager Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
