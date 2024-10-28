function sendMessage() {
  const input = document.getElementById("user-input").value;
  if (input) {
    displayMessage("You", input);
    document.getElementById("user-input").value = "";
  }
}

function displayMessage(sender, message) {
  const chatLog = document.getElementById("chat-log");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("mb-2");

  // Parse the message using marked.js and sanitize it using DOMPurify
  const parsedMessage = marked.parse(message);

  messageDiv.innerHTML = `<strong>${sender}:</strong> ${parsedMessage}`;
  chatLog.appendChild(messageDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
}
