import React from 'react';

/**
 * JJ Review System — Official Vector Brand Logo
 * Features the signature stylized "iU" icon with radiant golden accent dot
 * on a vibrant electric rose-crimson gradient.
 */
export function JJLogo({ size = 34, rounded = 10, showGlow = false, className = '' }) {
  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: `${rounded}px`,
        background: 'linear-gradient(135deg, #FF0055 0%, #E11D48 50%, #BE123C 100%)',
        boxShadow: showGlow ? '0 4px 14px rgba(225, 29, 72, 0.35)' : '0 2px 6px rgba(225, 29, 72, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      <svg
        width={size * 0.72}
        height={size * 0.72}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Subtle diagonal shadow under the right leg */}
        <path
          d="M 68 25 L 85 45 L 85 85 L 50 85 Z"
          fill="rgba(0, 0, 0, 0.08)"
        />

        {/* Yellow/Gold Accent Dot above left stem */}
        <circle
          cx="28"
          cy="30"
          r="9.5"
          fill="#FFC107"
        />

        {/* Main stylized U shape with left stem (i) */}
        <path
          d="M 22 39 
             H 34 
             V 60 
             C 34 71, 41 78, 50 78 
             C 59 78, 66 71, 66 60 
             V 25 
             H 78 
             V 60 
             C 78 77, 65 90, 50 90 
             C 35 90, 22 77, 22 60 
             Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}

export default JJLogo;
