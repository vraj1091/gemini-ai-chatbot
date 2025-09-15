import React, { useEffect, useRef } from 'react';
import Message from './Message';
import LoadingMessage from './LoadingMessage';

const ChatContainer = ({ messages, isLoading, error }) => {
  const chatEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading && !error) {
    return (
      <div className="chat-container" ref={containerRef}>
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <h3>Welcome to Gemini AI Chatbot</h3>
          <p>Start a conversation by typing a message below. I'm powered by Google's Gemini AI and ready to help with any questions you have!</p>
          <div className="example-prompts">
            <p><strong>Try asking:</strong></p>
            <ul>
              <li>"Explain quantum computing in simple terms"</li>
              <li>"Write a short poem about nature"</li>
              <li>"Help me plan a weekend trip"</li>
              <li>"What are the latest trends in AI?"</li>
              <li>"Create a simple recipe for dinner"</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container" ref={containerRef}>
      <div className="messages">
        {messages.map((message, index) => (
          <Message 
            key={`${message.timestamp}-${index}`} 
            message={message} 
            isLatest={index === messages.length - 1}
          />
        ))}

        {isLoading && <LoadingMessage />}

        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <div className="error-text">{error}</div>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
