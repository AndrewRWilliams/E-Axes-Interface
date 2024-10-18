const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", sendMessage);

function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message-bubble");
    messageBubble.innerText = message;
    chatBox.appendChild(messageBubble);
    chatInput.value = ""; // Clear the input field
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
  }
}

/* Optional: Send message on Enter key */
chatInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
