// App.js
import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Sage, your AI assistant. How can I help you today?",
      sender: 'bot',
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;
    
    // Add user message
    const newUserMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Send request to Flask backend
      const response = await fetch('https://sage-backend-7.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newUserMessage.text }),
      });
      
      const data = await response.json();
      
      // Add bot response
      const botResponse = {
        id: Date.now() + 1,
        text: data.response || "Sorry, I couldn't process your request.",
        sender: 'bot',
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, there was an error connecting to the server.",
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <header className="header">
          <h1>Sage 2.0</h1>
          <div className="settings-icon">⚙️</div>
        </header>
        
        <div className="chat-area">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className={`avatar ${message.sender === 'user' ? 'user-avatar' : 'bot-avatar'}`}>
                {message.sender === 'user' ? 'U' : 'S'}
              </div>
              <div className={`message-bubble ${message.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot-message">
              <div className="avatar bot-avatar">S</div>
              <div className="message-bubble bot-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="input-area" onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              placeholder="Message Sage..."
              value={inputValue}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className={`send-button ${isLoading ? 'disabled' : ''}`}
            disabled={isLoading}
          >
            <svg className="send-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M5 12H19M19 12L12 5M19 12L12 19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
