let username = null;

function login() {
  const input = document.getElementById("username");
  if (input.value.trim() === "") {
    alert("Please enter a username.");
    return;
  }

  username = input.value.trim();
  document.getElementById("login-container").style.display = "none";
  document.getElementById("chat-container").style.display = "block";
}

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (message === "") return;

  addMessage(username, message);
  input.value = "";

  // ✅ Call Flask backend with username + message
  fetch("http://127.0.0.1:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,  // ✅ now sending username to backend
      message: message
    })
  })
    .then(res => res.json())
    .then(data => {
      addMessage("Bot", data.reply);
    });
}

function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
