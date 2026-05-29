import './SocialSidebar.css';

function IconInstagram() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    </svg>
  );
}

export default function SocialSidebar() {
  return (
    <div className="social-sidebar" aria-label="Social Media Links">
      <a 
        href="https://www.instagram.com/mindwaves2026?igsh=MXFrYWV0OXMyZ2N0aA==" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-sidebar__link instagram"
        title="Follow us on Instagram"
      >
        <IconInstagram />
        <span className="social-sidebar__tooltip">Instagram</span>
      </a>
      <a 
        href="https://www.tiktok.com/@mind.waves40?_r=1&_t=ZS-96FLSPt0wcf" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-sidebar__link tiktok"
        title="Follow us on TikTok"
      >
        <IconTikTok />
        <span className="social-sidebar__tooltip">TikTok</span>
      </a>
    </div>
  );
}
