
let username = null;

function login() {
  const input = document.getElementById("username");
  if (input.value.trim() === "") {
    showNotification("Please enter a username.", "warning");
    input.focus();
    return;
  }

  username = input.value.trim();
  
  // Add loading state
  const loginBtn = document.querySelector("#login-container button");
  loginBtn.classList.add("loading");
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging in...';
  
  setTimeout(() => {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
    
    // Welcome message
    addMessage("Bot", `👋 Welcome ${username}! I'm your AI shopping assistant. How can I help you find products today?`);
    
    // Focus on input
    document.getElementById("user-input").focus();
  }, 800);
}

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (message === "") return;

  // Add user message
  addMessage(username, message);
  input.value = "";

  // Show typing indicator
  showTypingIndicator();

  // Call Flask backend
  fetch("http://127.0.0.1:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      message: message
    })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      hideTypingIndicator();
      addMessage("Bot", data.reply);
    })
    .catch(error => {
      hideTypingIndicator();
      addMessage("Bot", "😔 Sorry, I'm having trouble connecting to the server. Please try again later.");
      console.error("Error:", error);
    });
}

function quickMessage(message) {
  const input = document.getElementById("user-input");
  input.value = message;
  
  // Add visual feedback
  const chatBox = document.getElementById("chat-box");
  chatBox.scrollTop = chatBox.scrollHeight;
  
  // Auto-send after brief delay
  setTimeout(() => {
    sendMessage();
  }, 300);
}

function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  
  // Add icons for different senders
  const icon = sender === "Bot" ? "🤖" : "👤";
  const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  msg.innerHTML = `
    <div class="d-flex align-items-start gap-2">
      <span class="sender-icon">${icon}</span>
      <div class="message-content flex-1">
        <div class="sender-name">
          <strong style="color: ${sender === 'Bot' ? '#8b5cf6' : '#059669'};">${sender}</strong>
          <small class="text-muted ms-2">${timestamp}</small>
        </div>
        <div class="message-text">${formatMessage(text)}</div>
      </div>
    </div>
  `;
  
  chatBox.appendChild(msg);
  
  // Smooth scroll to bottom
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: 'smooth'
  });
  
  // Add sound notification for bot messages
  if (sender === "Bot") {
    playNotificationSound();
  }
}

function formatMessage(text) {
  // Basic text formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/₹(\d+)/g, '<span class="price-tag">₹$1</span>');
}

function showTypingIndicator() {
  const chatBox = document.getElementById("chat-box");
  const typingDiv = document.createElement("div");
  typingDiv.id = "typing-indicator";
  typingDiv.className = "typing-indicator";
  typingDiv.innerHTML = `
    <div class="d-flex align-items-center gap-2">
      <span class="sender-icon">🤖</span>
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <small class="text-muted">Bot is typing...</small>
    </div>
  `;
  
  chatBox.appendChild(typingDiv);
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: 'smooth'
  });
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  notification.style.cssText = "top: 20px; right: 20px; z-index: 1050; min-width: 300px;";
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}

function playNotificationSound() {
  // Create a subtle notification sound
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Keyboard shortcuts
document.addEventListener('DOMContentLoaded', function() {
  // Enter key to send message
  const userInput = document.getElementById("user-input");
  if (userInput) {
    userInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  // Enter key to login
  const usernameInput = document.getElementById("username");
  if (usernameInput) {
    usernameInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        login();
      }
    });
    usernameInput.focus();
  }
});

// Add CSS for typing indicator
const style = document.createElement('style');
style.textContent = `
  .typing-indicator {
    padding: 12px 16px;
    margin-bottom: 15px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    border: 1px solid rgba(167, 139, 250, 0.2);
    max-width: 85%;
  }
  
  .typing-dots {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  
  .typing-dots span {
    width: 8px;
    height: 8px;
    background: #8b5cf6;
    border-radius: 50%;
    animation: typing 1.4s infinite;
  }
  
  .typing-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .typing-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.5;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
  
  .price-tag {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.9em;
  }
  
  .sender-icon {
    font-size: 1.2em;
    margin-top: 2px;
  }
  
  .message-content {
    flex: 1;
  }
  
  .sender-name {
    margin-bottom: 4px;
  }
  
  .message-text {
    line-height: 1.5;
  }
`;
document.head.appendChild(style);
