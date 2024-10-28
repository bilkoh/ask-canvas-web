function sendMessage() {
  const input = document.getElementById("user-input").value;
  if (input) {
    displayMessage("You", input);
    document.getElementById("user-input").value = "";
  }
}

// document.getElementById("send-button").addEventListener("click", sendMessage);
// document.getElementById("send-button").addEventListener("click", handleSubmit);

// Attach "Enter" key event listener to the input field
// document
//   .getElementById("user-input")
//   .addEventListener("keypress", function (event) {
//     if (event.key === "Enter") {
//     //   sendMessage();
//       event.preventDefault();
//     }
//   });

function displayMessage(sender, message) {
  const chatLog = document.getElementById("chat-log");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("mb-2");
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatLog.appendChild(messageDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
}
