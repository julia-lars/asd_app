import React from 'react';

/* ---- 统一 SVG 图标，与底部导航栏风格一致：1.65px stroke, round caps ---- */

const iconProps = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true, focusable: false };
const stroke = { stroke: 'currentColor', strokeWidth: 1.65, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const IconKnowledge = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="12" cy="6" r="2.5" {...stroke} />
    <circle cx="6" cy="18" r="2.5" {...stroke} />
    <circle cx="18" cy="18" r="2.5" {...stroke} />
    <path d="M10.5 8l-3.5 7.5M12 8.5l2.5 5.5M15.5 8.5l3.5 7" {...stroke} />
  </svg>
);

export const IconToolbox = (props) => (
  <svg {...iconProps} {...props}>
    <rect x="3" y="7" width="18" height="13" rx="2" {...stroke} />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...stroke} />
    <circle cx="12" cy="14" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconResources = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" {...stroke} />
    <path d="M10 3v6h6" {...stroke} />
    <path d="M8 13h8M8 17h5" {...stroke} />
  </svg>
);

export const IconContact = (props) => (
  <svg {...iconProps} {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" {...stroke} />
    <path d="m2 7 10 7 10-7" {...stroke} />
  </svg>
);

export const IconGroup = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="9" cy="8" r="3" {...stroke} />
    <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" {...stroke} />
    <circle cx="17" cy="9" r="2.2" {...stroke} />
    <path d="M21 19v-1a3.5 3.5 0 0 0-2.5-3.3" {...stroke} />
  </svg>
);

export const IconExpert = (props) => (
  <svg {...iconProps} {...props}>
    <rect x="3" y="4" width="18" height="16" rx="3" {...stroke} />
    <circle cx="9" cy="11" r="2" {...stroke} />
    <path d="M5 18c1.5-2 3.5-3 5.5-3" {...stroke} />
    <path d="M13 11h5M13 14h4" {...stroke} />
  </svg>
);

export const IconSearch = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="10.5" cy="10.5" r="6" {...stroke} />
    <path d="m16 16 4.5 4.5" {...stroke} />
  </svg>
);

export const IconAudio = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M5 16V9a7 7 0 0 1 14 0v7" {...stroke} />
    <path d="M5 16h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" fill="currentColor" stroke="none" />
    <path d="M18 16h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" fill="currentColor" stroke="none" />
    <path d="M8 9h8M9 12h6" {...stroke} />
  </svg>
);

export const IconVideo = (props) => (
  <svg {...iconProps} {...props}>
    <rect x="2" y="5" width="15" height="14" rx="2" {...stroke} />
    <path d="m17 12 4.5 3.5V8.5L17 12Z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconDashboard = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M3 20V10a5 5 0 0 1 10 0v10" {...stroke} />
    <path d="M3 20h10" {...stroke} />
    <path d="M17 20V7a3 3 0 0 1 6 0v13" {...stroke} />
    <path d="M17 20h6" {...stroke} />
  </svg>
);

export const IconCrown = (props) => (
  <svg {...iconProps} {...props}>
    <path d="m5 15 2-8 5 4 5-4 2 8" {...stroke} />
    <path d="M5 15h14v3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-3Z" {...stroke} />
  </svg>
);

export const IconDiamond = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M12 2l7 7-7 7-7-7 7-7Z" {...stroke} />
    <path d="M12 9v7" {...stroke} />
    <circle cx="12" cy="8" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const IconLock = (props) => (
  <svg {...iconProps} {...props}>
    <rect x="5" y="10" width="14" height="10" rx="2" {...stroke} />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" {...stroke} />
    <circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconChevronDown = (props) => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconExternal = (props) => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCheck = (props) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="10" fill="#dcfce7" stroke="#22c55e" strokeWidth={1.8} />
    <path d="M7.5 12l3 3 6-6" stroke="#16a34a" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCross = (props) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="10" fill="#fee2e2" stroke="#ef4444" strokeWidth={1.2} />
    <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#dc2626" strokeWidth={1.8} strokeLinecap="round" />
  </svg>
);

export const IconClose = (props) => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

export const IconHeart = (props) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" stroke="currentColor" strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconTrash = (props) => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconSeedling = (props) => (
  <svg width={40} height={40} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCelebrate = (props) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4" stroke="currentColor" strokeWidth={1.65} strokeLinecap="round" />
    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
  </svg>
);

export const IconGlobe = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="12" cy="12" r="9" {...stroke} />
    <ellipse cx="12" cy="12" rx="4" ry="9" {...stroke} />
    <path d="M3 12h18" {...stroke} />
    <path d="m7 7 2 8 3-3 3 5 3-7" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const IconProfile = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="12" cy="8" r="4" {...stroke} />
    <path d="M5 21v-1a7 7 0 0 1 14 0v1" {...stroke} />
  </svg>
);

export const IconSettings = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="12" cy="12" r="3" {...stroke} />
    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" {...stroke} />
  </svg>
);

export const IconFontSize = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M3 20V4h5l3 4 3-4h5v16" {...stroke} />
    <path d="M7 12h10M7 8h10" {...stroke} strokeWidth={1} />
  </svg>
);

export const IconPassword = (props) => (
  <svg {...iconProps} {...props}>
    <rect x="5" y="10" width="14" height="10" rx="2" {...stroke} />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" {...stroke} />
    <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" />
    <path d="M12 12v3" {...stroke} strokeWidth={1.2} />
  </svg>
);

export const IconPhone = (props) => (
  <svg {...iconProps} {...props}>
    <rect x="6" y="3" width="12" height="18" rx="2" {...stroke} />
    <path d="M10 18h4" {...stroke} />
  </svg>
);
