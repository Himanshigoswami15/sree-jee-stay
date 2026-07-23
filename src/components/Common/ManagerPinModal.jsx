import React, { useState } from 'react';
import { ShieldCheck, KeyRound, X, AlertCircle, Mail, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

export function ManagerPinModal() {
  const { isPinModalOpen, setIsPinModalOpen, verifyPin, resetPinAndAuthenticate, settings } = useFeedback();
  
  // View mode: 'login' | 'forgot'
  const [viewMode, setViewMode] = useState('login');
  
  // Login Form state
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Forgot Password / Reset state
  const [emailInput, setEmailInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [resetError, setResetError] = useState('');

  if (!isPinModalOpen) return null;

  // Handle standard PIN Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = verifyPin(pinInput);
    if (success) {
      setPinInput('');
      setLoginError('');
      setViewMode('login');
    } else {
      setLoginError('Incorrect Security PIN. Please try again.');
      setPinInput('');
    }
  };

  // Initiate Forgot Password Flow
  const handleStartForgotPassword = () => {
    setResetError('');
    setEmailInput('');
    setNewPin('');
    setViewMode('forgot');
  };

  // Handle Email Verification PIN Reset
  const handleResetSubmit = (e) => {
    e.preventDefault();

    const savedEmail = (settings.managerEmail || 'info@sreejeestay.com').trim().toLowerCase();
    const userEmail = emailInput.trim().toLowerCase();

    // Verify entered email matches the saved manager email
    if (userEmail !== savedEmail) {
      setResetError(`Email address does not match saved Manager Email (${settings.managerEmail || 'info@sreejeestay.com'}).`);
      return;
    }

    if (!newPin || newPin.length < 4) {
      setResetError('New PIN must be at least 4 digits.');
      return;
    }

    // Update PIN and directly log into Manager Dashboard
    resetPinAndAuthenticate(newPin);
    
    // Reset modal state
    setViewMode('login');
    setPinInput('');
    setLoginError('');
    setResetError('');
    setEmailInput('');
    setNewPin('');
  };

  const handleClose = () => {
    setIsPinModalOpen(false);
    setViewMode('login');
    setPinInput('');
    setLoginError('');
    setResetError('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* View Mode 1: Standard Manager Security PIN Login */}
        {viewMode === 'login' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '-0.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, var(--primary), #4338ca)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 8px 22px rgba(79, 70, 229, 0.35)',
                }}
              >
                <ShieldCheck size={30} />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Manager Security Access
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Enter your Manager Security PIN to access analytics & settings for <strong>{settings.hotelName}</strong>.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', marginTop: '0.5rem' }}>
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
                      setLoginError('');
                    }}
                    placeholder="••••"
                    autoFocus
                    required
                  />
                </div>
                {loginError && (
                  <div style={{ fontSize: '0.8rem', color: '#fb7185', marginTop: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <AlertCircle size={14} /> {loginError}
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary-action">
                <Lock size={18} /> Unlock Manager Dashboard
              </button>

              <button
                type="button"
                onClick={handleStartForgotPassword}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0.35rem',
                  textDecoration: 'underline'
                }}
              >
                Forgot Security PIN / Password?
              </button>
            </form>
          </>
        )}

        {/* View Mode 2: Reset PIN via Saved Manager Email */}
        {viewMode === 'forgot' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '-0.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 8px 22px rgba(2, 132, 199, 0.35)',
                }}
              >
                <Mail size={28} />
              </div>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Reset Manager Password
              </h2>
              <p style={{ fontSize: '0.835rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Verify your identity by entering your saved <strong>Duty Manager Email</strong> to set a new PIN.
              </p>
            </div>

            <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label">Saved Duty Manager Email:</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem' }} />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', fontSize: '0.95rem' }}
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setResetError('');
                    }}
                    placeholder={settings.managerEmail || 'info@sreejeestay.com'}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label">New Manager Security PIN:</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem' }} />
                  <input
                    type="password"
                    maxLength={8}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', fontSize: '1rem', fontWeight: 700 }}
                    value={newPin}
                    onChange={(e) => {
                      setNewPin(e.target.value);
                      setResetError('');
                    }}
                    placeholder="Enter new 4-digit PIN"
                    required
                  />
                </div>
              </div>

              {resetError && (
                <div style={{ fontSize: '0.8rem', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', background: '#fff1f2', padding: '0.55rem', borderRadius: '10px', border: '1px solid #fda4af' }}>
                  <AlertCircle size={14} /> {resetError}
                </div>
              )}

              <button type="submit" className="btn-primary-action">
                <CheckCircle2 size={18} /> Reset PIN & Open Dashboard
              </button>

              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => {
                  setViewMode('login');
                  setResetError('');
                }}
              >
                <ArrowLeft size={16} /> Back to Security Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
