import React from 'react';

const LoadingMessage = () => {
  return (
    <div className="message assistant loading">
      <div className="message-avatar">🤖</div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">AI Assistant</span>
        </div>
        <div className="loading-container">
          <span className="loading-text">Thinking</span>
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
