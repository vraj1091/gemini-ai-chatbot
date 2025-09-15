import React, { useState, useEffect } from 'react';
import ChatContainer from './components/ChatContainer';
import MessageInput from './components/MessageInput';
import { callGeminiAPI } from './services/geminiApi';
import './styles/App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if API key is configured
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const apiKeyConfigured = apiKey && apiKey !== 'your_api_key_here' && apiKey.trim().length > 0;

  // Debug API key loading (remove in production)
  useEffect(() => {
    console.log('API Key status:', {
      exists: !!apiKey,
      length: apiKey?.length || 0,
      startsWithAIza: apiKey?.startsWith('AIza') || false,
      configured: apiKeyConfigured
    });
  }, [apiKey, apiKeyConfigured]);

  const handleSendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    if (!apiKeyConfigured) {
      setError('Please configure your Google AI Studio API key in the .env file');
      return;
    }

    // Add user message to chat
    const newUserMessage = { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);

    setIsLoading(true);
    setError(null);

    try {
      const response = await callGeminiAPI(userMessage);
      const aiMessage = { 
        role: 'assistant', 
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error calling Gemini API:', err);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';

      if (err.message.includes('API key not valid')) {
        errorMessage = 'Invalid API key. Please check your Google AI Studio API key.';
      } else if (err.message.includes('quota') || err.message.includes('429')) {
        errorMessage = 'API quota exceeded. Please try again later.';
      } else if (err.message.includes('403')) {
        errorMessage = 'API access forbidden. Please check your API key permissions.';
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        handleClearChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <span className="header-icon">🤖</span>
            <h1>Gemini AI Chatbot</h1>
          </div>
          {messages.length > 0 && (
            <button 
              className="clear-button" 
              onClick={handleClearChat}
              title="Clear chat (Ctrl+K)"
            >
              Clear Chat
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {!apiKeyConfigured && (
          <div className="config-warning">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <h3>API Key Issue</h3>
              <p>
                Your API key appears to be configured but there might be an issue.
              </p>
              <p><strong>Current status:</strong></p>
              <ul>
                <li>API Key exists: {apiKey ? '✅ Yes' : '❌ No'}</li>
                <li>API Key length: {apiKey?.length || 0} characters</li>
                <li>Starts with AIza: {apiKey?.startsWith('AIza') ? '✅ Yes' : '❌ No'}</li>
              </ul>
              <p>
                If you're still seeing this message, try restarting the development server:
                <code>npm start</code>
              </p>
            </div>
          </div>
        )}

        <ChatContainer 
          messages={messages} 
          isLoading={isLoading} 
          error={error}
        />

        <MessageInput 
          onSendMessage={handleSendMessage}
          disabled={isLoading || !apiKeyConfigured}
          placeholder={
            !apiKeyConfigured 
              ? "Please configure your API key first..." 
              : isLoading 
                ? "AI is typing..." 
                : "Type your message..."
          }
        />
      </main>
    </div>
  );
}

export default App;
