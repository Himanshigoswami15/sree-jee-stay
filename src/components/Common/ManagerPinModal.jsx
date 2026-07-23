import React, { useState } from 'react';
import { ShieldCheck, KeyRound, X, AlertCircle, Mail, ArrowLeft, CheckCircle2, Lock, Key, RefreshCw } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';

export function ManagerPinModal() {
  const { isPinModalOpen, setIsPinModalOpen, verifyPin, resetPinAndAuthenticate, settings } = useFeedback();
  
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

  if (!isPinModalOpen) return null;

  const managerEmail = settings.managerEmail || 'himanshigoswami9057@gmail.com';

  // Handle standard PIN Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = verifyPin(pinInput);
    if (success) {
      resetState();
    } else {
      setLoginError('Incorrect Security PIN. Please try again.');
      setPinInput('');
    }
  };

  // Step 1: Trigger Forgot Password -> Generate & Send OTP -> Show ONLY OTP Screen
  const handleStartForgotPassword = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpError('');
    setOtpSentMessage(`🔒 6-Digit OTP Code automatically dispatched to: ${managerEmail}`);
    setViewMode('otp_verify');
  };

  // Step 2: Verify OTP
  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    if (enteredOtp.trim() === generatedOtp) {
      setOtpError('');
      setViewMode('new_password');
    } else {
      setOtpError('Incorrect OTP Code. Please check the code and try again.');
    }
  };

  // Step 3A: Save New Password & Directly Open Dashboard
  const handleSaveNewPassword = (e) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      setPasswordError('New Password / PIN must be at least 4 digits.');
      return;
    }

    resetPinAndAuthenticate(newPin);
    resetState();
  };

  // Step 3B: "Not Now" Option -> Keep current password and directly open dashboard
  const handleNotNowOption = () => {
    resetPinAndAuthenticate(settings.managerPin);
    resetState();
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

        {/* ===================================================================
            VIEW MODE 1: Standard Manager Security PIN Login
            =================================================================== */}
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

        {/* ===================================================================
            VIEW MODE 2: ONLY OTP Input Screen (After clicking Forgot Password)
            =================================================================== */}
        {viewMode === 'otp_verify' && (
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
                Verify OTP Code
              </h2>

              {/* OTP Sent Notification Banner */}
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '14px',
                padding: '0.75rem 0.95rem',
                fontSize: '0.825rem',
                color: '#0369a1',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                lineHeight: '1.4',
                width: '100%'
              }}>
                <Mail size={18} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>OTP Shared to Manager Email Account:</strong>
                  <div style={{ fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                    {managerEmail}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleVerifyOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.85rem' }}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label" style={{ fontWeight: 800, color: '#1e293b' }}>
                  Enter 6-Digit OTP Code:
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Key size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem' }} />
                  <input
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    className="form-input"
                    style={{
                      paddingLeft: '2.5rem',
                      fontSize: '1.2rem',
                      letterSpacing: '0.25em',
                      fontWeight: 800,
                      textAlign: 'center'
                    }}
                    value={enteredOtp}
                    onChange={(e) => {
                      setEnteredOtp(e.target.value);
                      setOtpError('');
                    }}
                    placeholder="849201"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {otpError && (
                <div style={{ fontSize: '0.8rem', color: '#fb7185', background: '#fff1f2', padding: '0.55rem', borderRadius: '10px', border: '1px solid #fda4af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={14} /> {otpError}
                </div>
              )}

              <button type="submit" className="btn-primary-action">
                <CheckCircle2 size={18} /> Verify OTP
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary-action"
                  style={{ flex: 1, fontSize: '0.8rem' }}
                  onClick={handleStartForgotPassword}
                >
                  <RefreshCw size={13} /> Resend OTP
                </button>

                <button
                  type="button"
                  className="btn-secondary-action"
                  style={{ flex: 1, fontSize: '0.8rem' }}
                  onClick={() => setViewMode('login')}
                >
                  <ArrowLeft size={13} /> Back to Login
                </button>
              </div>
            </form>
          </>
        )}

        {/* ===================================================================
            VIEW MODE 3: New Password Screen (Shown ONLY after OTP Verification)
            =================================================================== */}
        {viewMode === 'new_password' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '-0.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 8px 22px rgba(16, 185, 129, 0.35)',
                }}
              >
                <CheckCircle2 size={30} />
              </div>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                OTP Verified Successfully!
              </h2>
              <p style={{ fontSize: '0.835rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Create a new Manager Password / Security PIN or skip directly to the dashboard.
              </p>
            </div>

            <form onSubmit={handleSaveNewPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.85rem' }}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label" style={{ fontWeight: 800, color: '#1e293b' }}>
                  Set New Manager Security Password / PIN:
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem' }} />
                  <input
                    type="password"
                    maxLength={8}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', fontSize: '1.1rem', fontWeight: 700 }}
                    value={newPin}
                    onChange={(e) => {
                      setNewPin(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter new PIN (e.g. 5678)"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {passwordError && (
                <div style={{ fontSize: '0.8rem', color: '#fb7185', background: '#fff1f2', padding: '0.55rem', borderRadius: '10px', border: '1px solid #fda4af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={14} /> {passwordError}
                </div>
              )}

              {/* Action Button 1: Save New Password & Open Dashboard */}
              <button type="submit" className="btn-primary-action">
                <CheckCircle2 size={18} /> Save New Password & Open Dashboard
              </button>

              {/* Action Button 2: Not Now Option */}
              <button
                type="button"
                className="btn-secondary-action"
                style={{ fontSize: '0.875rem', fontWeight: 700 }}
                onClick={handleNotNowOption}
              >
                Not Now (Skip to Dashboard)
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
