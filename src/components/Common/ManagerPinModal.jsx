import React, { useState } from 'react';
import { ShieldCheck, KeyRound, X, AlertCircle, Mail, ArrowLeft, CheckCircle2, Lock, Key, RefreshCw } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { JJLogo } from './JJLogo';

export function ManagerPinModal() {
  const { isPinModalOpen, setIsPinModalOpen, verifyPin, resetPinAndAuthenticate, authenticateAndOpenDashboard, settings } = useFeedback();
  
  // View Modes: 'login' | 'otp_verify' | 'new_password'
  const [viewMode, setViewMode] = useState('login');
  
  // Standard Login State
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // OTP Verification State
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState('');

  // New Password State
  const [newPin, setNewPin] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isPinModalOpen) return null;

  const managerEmail = settings?.managerEmail || 'himanshigoswami9057@gmail.com';
  const propertyName = settings?.hotelName || settings?.name || 'Selected Property';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');
    try {
      const res = await verifyPin(pinInput);
      if (res.success) {
        resetState();
      } else {
        setLoginError(res.error || 'Incorrect Security PIN. Please try again.');
        setPinInput('');
      }
    } catch (err) {
      setLoginError('Error verifying PIN. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartForgotPassword = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpError('');
    setOtpSentMessage(`6-Digit OTP dispatched to: ${managerEmail}`);
    setViewMode('otp_verify');
  };

  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    if (enteredOtp.trim() === generatedOtp.trim()) {
      setViewMode('new_password');
      setOtpError('');
    } else {
      setOtpError('Invalid 6-digit OTP code. Please enter the correct code.');
    }
  };

  const handleSetNewPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPin || newPin.trim().length < 4) {
      setPasswordError('New PIN must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);
    setPasswordError('');
    try {
      const res = await resetPinAndAuthenticate(newPin.trim());
      if (res && res.success) {
        handleClose();
      } else {
        setPasswordError(res?.error || 'Failed to update PIN.');
      }
    } catch (err) {
      setPasswordError(err?.message || 'Error updating PIN.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setViewMode('login');
    setPinInput('');
    setLoginError('');
    setGeneratedOtp('');
    setEnteredOtp('');
    setOtpError('');
    setOtpSentMessage('');
    setNewPin('');
    setPasswordError('');
  };

  const handleClose = () => {
    setIsPinModalOpen(false);
    resetState();
  };

  return (
    <div className="saas-modal-overlay" onClick={handleClose}>
      <div className="saas-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', padding: '2rem 1.75rem', textAlign: 'center' }}>
        <button
          type="button"
          onClick={handleClose}
          className="saas-btn saas-btn-ghost"
          style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '4px' }}
        >
          <X size={18} />
        </button>

        {/* VIEW 1: Standard Manager Login */}
        {viewMode === 'login' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <JJLogo size={48} rounded={13} showGlow={true} />
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 0.35rem' }}>
              Manager Authentication
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Enter your Security PIN to unlock analytics and settings for <strong>{propertyName}</strong>.
            </p>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <KeyRound size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '1rem' }} />
                  <input
                    type="password"
                    maxLength={8}
                    className="saas-input"
                    disabled={isSubmitting}
                    style={{
                      paddingLeft: '2.5rem',
                      fontSize: '1.25rem',
                      letterSpacing: '0.3em',
                      textAlign: 'center',
                      fontWeight: 700,
                      height: '46px',
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
                  <div className="saas-badge saas-badge-danger" style={{ marginTop: '0.5rem', width: '100%', padding: '0.4rem' }}>
                    <AlertCircle size={13} /> <span>{loginError}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="saas-btn saas-btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', height: '44px', justifyContent: 'center', fontSize: '0.9375rem' }}
              >
                {isSubmitting ? 'Authenticating...' : 'Unlock Dashboard'}
              </button>

              <button
                type="button"
                onClick={handleStartForgotPassword}
                className="saas-btn saas-btn-ghost"
                style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}
              >
                Forgot PIN? Reset via OTP
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: OTP Verification */}
        {viewMode === 'otp_verify' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-rose)' }}>
                <Mail size={24} />
              </div>
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)', margin: '0 0 0.35rem' }}>
              Security OTP Verification
            </h2>

            {otpSentMessage && (
              <div className="saas-badge saas-badge-brand" style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)' }}>
                {otpSentMessage}
              </div>
            )}

            <form onSubmit={handleVerifyOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <input
                  type="text"
                  maxLength={6}
                  className="saas-input"
                  value={enteredOtp}
                  onChange={(e) => { setEnteredOtp(e.target.value); setOtpError(''); }}
                  placeholder="Enter 6-digit OTP"
                  style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.25em', height: '46px', fontWeight: 700 }}
                  autoFocus
                  required
                />
                {otpError && (
                  <div className="saas-badge saas-badge-danger" style={{ marginTop: '0.5rem', width: '100%', padding: '0.4rem' }}>
                    <AlertCircle size={13} /> {otpError}
                  </div>
                )}
              </div>

              <div style={{ background: 'var(--slate-50)', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', fontSize: '0.75rem', color: 'var(--slate-600)' }}>
                Demo Verification Code: <strong style={{ color: 'var(--brand-rose)', fontFamily: 'monospace' }}>{generatedOtp}</strong>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => setViewMode('login')} className="saas-btn saas-btn-secondary" style={{ flex: 1 }}>
                  Back
                </button>
                <button type="submit" className="saas-btn saas-btn-primary" style={{ flex: 2 }}>
                  Verify OTP
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 3: Set New Password */}
        {viewMode === 'new_password' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--emerald-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald-600)' }}>
                <CheckCircle2 size={26} />
              </div>
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)', margin: '0 0 0.35rem' }}>
              Set New Security PIN
            </h2>

            <form onSubmit={handleSetNewPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <input
                  type="password"
                  className="saas-input"
                  value={newPin}
                  onChange={(e) => { setNewPin(e.target.value); setPasswordError(''); }}
                  placeholder="Enter new 4+ digit PIN"
                  style={{ textAlign: 'center', height: '46px', fontSize: '1.1rem', fontWeight: 700 }}
                  autoFocus
                  required
                />
                {passwordError && (
                  <div className="saas-badge saas-badge-danger" style={{ marginTop: '0.5rem', width: '100%', padding: '0.4rem' }}>
                    <AlertCircle size={13} /> {passwordError}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="saas-btn saas-btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', height: '44px', justifyContent: 'center' }}
              >
                {isSubmitting ? 'Updating PIN...' : 'Save & Open Dashboard'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
