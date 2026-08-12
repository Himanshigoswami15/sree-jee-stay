import React from 'react';
import logoImg from '../../assets/jj-logo.png';

/**
 * JJ Review System — Official Brand Logo
 * Renders the exact official logo asset (Stylized white 'U' with golden accent dot
 * and long shadow on electric crimson-rose canvas).
 */
export function JJLogo({ size = 36, rounded = 10, showGlow = false, className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: `${rounded}px`,
        overflow: 'hidden',
        boxShadow: showGlow
          ? '0 4px 14px rgba(225, 29, 72, 0.35)'
          : '0 2px 6px rgba(225, 29, 72, 0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        userSelect: 'none',
        background: '#FF0055',
        ...style,
      }}
    >
      <img
        src={logoImg}
        alt="JJ Review System Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  );
}

export default JJLogo;
