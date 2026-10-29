/* Blobby — the emids teal round character (chosen mascot, was candidate #2) */
export default function Mascot() {
  return (
    <div className="mascot-celebr pointer-events-none relative inline-block" aria-hidden>
      <span aria-hidden className="mascot-sparkle bg-gold" style={{ top: 2, left: -12 }} />
      <span aria-hidden className="mascot-sparkle" style={{ top: -4, right: -10, background: '#7a5af8', animationDelay: '0.12s' }} />
      <span aria-hidden className="mascot-sparkle" style={{ bottom: 20, right: -14, background: 'var(--color-brand)', animationDelay: '0.26s' }} />
      <svg width="88" height="88" viewBox="0 0 120 120" fill="none" className="mascot-bob">
        <defs>
          <linearGradient id="mascotBlob" x1="20" y1="22" x2="100" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#156F63" />
            <stop offset="55%" stopColor="#0E9384" />
            <stop offset="100%" stopColor="#0AA393" />
          </linearGradient>
        </defs>
        <ellipse className="mascot-breathe" cx="60" cy="106" rx="26" ry="5" fill="rgba(21,64,113,0.16)" />
        <path d="M28 92 C20 60, 26 28, 60 26 C94 28, 100 60, 92 92 C86 102, 34 102, 28 92 Z" fill="url(#mascotBlob)" />
        <path d="M34 84 C30 62, 36 40, 58 37 C52 52, 46 68, 34 84 Z" fill="#fff" opacity="0.10" />
        <g className="mascot-wave" style={{ transformOrigin: '94px 58px' }}>
          <path d="M96 62 C104 56, 110 48, 108 42" stroke="#0E9384" strokeWidth="9" strokeLinecap="round" fill="none" />
          <circle cx="107" cy="41" r="4.5" fill="#FFB224" />
        </g>
        <circle cx="23" cy="66" r="6.5" fill="#0E9384" />
        <g className="mascot-face" style={{ transformOrigin: '60px 48px' }}>
          <circle cx="49" cy="52" r="4.4" fill="#0a2038" /><circle cx="71" cy="52" r="4.4" fill="#0a2038" />
          <circle cx="50.5" cy="50.6" r="1.4" fill="#fff" /><circle cx="72.5" cy="50.6" r="1.4" fill="#fff" />
          <circle cx="43" cy="60" r="3.2" fill="#fff" opacity="0.35" /><circle cx="77" cy="60" r="3.2" fill="#fff" opacity="0.35" />
          <path d="M51 63 C57 69, 63 69, 69 63" stroke="#0a2038" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <circle cx="46" cy="66" r="2.6" fill="#0a2038" opacity="0.25" />
        </g>
        <text x="60" y="90" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" opacity="0.85">e</text>
        <path d="M14 16 L16 22 L22 24 L16 26 L14 32 L12 26 L6 24 L12 22 Z" fill="#FFB224" opacity="0.9" className="mascot-twinkle" style={{ transformOrigin: '14px 24px' }} />
      </svg>
    </div>
  )
}
