import React, { useState, useRef, useEffect } from 'react';

const MessageInput = ({ onSendMessage, disabled, placeholder }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  }, [message]);

  return (
    <div className="message-input-container">
      <form className="message-input-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="message-textarea"
            rows="1"
            maxLength="4000"
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="send-button"
            title="Send message (Enter)"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <div className="input-footer">
          <span className="char-counter">
            {message.length}/4000
          </span>
          <span className="input-hint">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
