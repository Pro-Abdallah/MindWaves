import { useState } from 'react';
import './ChatbotWidget.css';

function IconChat() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <path d="M8 10h.01"></path>
      <path d="M12 10h.01"></path>
      <path d="M16 10h.01"></path>
    </svg>
  );
}

function IconClose() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const chatbotUrl = "https://www.coze.com/s/ZaLM9pMXf/";

  return (
    <div className="cb-wrapper">
      {/* ── Floating Chat Button ── */}
      <button 
        className={`cb-launcher ${isOpen ? 'cb-launcher--open' : ''}`}
        onClick={toggleChat}
        aria-label="Open AI Mental Health Chatbot"
        title="Chat with AI Assistant"
      >
        <span className="cb-launcher__glow" />
        <span className="cb-launcher__pulse" />
        <span className="cb-launcher__icon">
          {isOpen ? <IconClose /> : <IconChat />}
        </span>
      </button>

      {/* ── Slide-out Chat Drawer ── */}
      <div className={`cb-drawer ${isOpen ? 'cb-drawer--active' : ''}`}>
        <div className="cb-drawer__header">
          <div className="cb-drawer__title-group">
            <span className="cb-drawer__avatar-pulse" />
            <div>
              <h3 className="cb-drawer__title">MindWaves Assistant</h3>
              <p className="cb-drawer__subtitle">AI Mental Health Support</p>
            </div>
          </div>
          
          <div className="cb-drawer__actions">
            <a 
              href={chatbotUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cb-drawer__btn"
              title="Open chat in new tab"
            >
              <IconExternalLink />
            </a>
            <button 
              onClick={toggleChat} 
              className="cb-drawer__btn cb-drawer__close"
              title="Close chat panel"
            >
              <IconClose />
            </button>
          </div>
        </div>

        <div className="cb-drawer__body">
          {isOpen && (
            <iframe 
              src={chatbotUrl}
              title="MindWaves AI Assistant"
              className="cb-drawer__iframe"
              allow="microphone; clipboard-write"
            />
          )}
        </div>
      </div>
    </div>
  );
}
