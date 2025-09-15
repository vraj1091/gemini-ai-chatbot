import React from 'react';

const Message = ({ message, isLatest }) => {
  const formatMessage = (text) => {
    // Basic markdown-like formatting for better display
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .split('\n').map(line => line.trim()).join('<br>');
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <div className={`message ${message.role} ${isLatest ? 'latest' : ''}`}>
      <div className="message-avatar">
        {message.role === 'user' ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">
            {message.role === 'user' ? 'You' : 'AI Assistant'}
          </span>
          <span className="message-time">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div 
          className="message-text"
          dangerouslySetInnerHTML={{ 
            __html: formatMessage(message.content) 
          }}
        />
      </div>
    </div>
  );
};

export default Message;
