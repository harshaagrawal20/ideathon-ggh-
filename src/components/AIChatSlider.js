import React, { useState, useEffect, useRef } from 'react';
import '../styles/AIChatSlider.css';
import { aiChatService } from '../services/aiChatService';

// Predefined AI responses
const AI_RESPONSES = {
  GREETING: "Hello! How can I assist you with your coding today?",
  HELP: "I can help you with:\n- Code explanations\n- Debugging\n- Best practices\n- Algorithm suggestions",
  DEFAULT: "I understand. Let me help you with that. Could you provide more details?",
  ERROR: "I'm not sure about that. Could you rephrase your question?"
};

// Simple response generator based on user input
const generateAIResponse = (message) => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return AI_RESPONSES.GREETING;
  } else if (lowerMsg.includes('help') || lowerMsg.includes('can you')) {
    return AI_RESPONSES.HELP;
  } else {
    return AI_RESPONSES.DEFAULT;
  }
};

const AIChatSlider = ({ isOpen, onClose, currentCode }) => {
  const sliderRef = useRef(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);
  const [error, setError] = useState(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Show welcome message when chat opens
  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      setChatHistory([
        { type: 'ai', content: "Hello! I'm your coding assistant. How can I help you today?" }
      ]);
    }
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sliderRef.current && !sliderRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setError(null);

    // Add user message to chat
    setChatHistory(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      // Get the current code context if needed
      const context = currentCode ? `Current code:\n${currentCode}\n\nQuestion:` : '';
      
      const aiResponse = await aiChatService.sendMessage(userMessage, context);
      setIsTyping(false);
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        content: aiResponse
      }]);
    } catch (err) {
      setIsTyping(false);
      setError('Failed to get AI response. Please try again.');
      console.error('Chat error:', err);
    }
  };

  return (
    <div className={`chat-slider ${isOpen ? 'open' : ''}`}>
      <div className="chat-slider-content" ref={sliderRef}>
        <div className="chat-header">
          <h2>AI Chat</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="chat-body" ref={chatBodyRef}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.type}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message ai">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          {error && (
            <div className="chat-error">
              {error}
            </div>
          )}
        </div>
        
        <div className="chat-footer">
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              autoComplete="off"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatSlider; 