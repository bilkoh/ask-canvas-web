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
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatLog.appendChild(messageDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
}
