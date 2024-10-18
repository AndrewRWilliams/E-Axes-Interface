const chats = [];  // Array to store all chat sessions
let currentChat = [];  // Array to store the current chat
let chatCount = 0;  // Track the number of chats
let isSidebarVisible = true;  // Track whether the sidebar is visible

const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const sidebar = document.getElementById("sidebar");
const newChatButton = document.getElementById("new-chat-button");
const toggleSidebarButton = document.getElementById("toggle-sidebar");

sendButton.addEventListener("click", sendMessage);
newChatButton.addEventListener("click", startNewChat);
toggleSidebarButton.addEventListener("click", toggleSidebar);

function toggleSidebar() {
  isSidebarVisible = !isSidebarVisible;

  if (isSidebarVisible) {
    sidebar.classList.remove("hidden");
    document.querySelector(".chat-area").classList.remove("expanded");
  } else {
    sidebar.classList.add("hidden");
    document.querySelector(".chat-area").classList.add("expanded");
  }
}

function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    // Add the user's message to the chat box
    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message-bubble", "user-message");
    messageBubble.innerText = message;
    chatBox.appendChild(messageBubble);

    // Save the message to the current chat session
    currentChat.push({ sender: "user", text: message });

    // Clear the input field
    chatInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom

    // Phase 1: Start with loading message
    displayLoadingMessage("Finding relevant articles...");
    setTimeout(() => {
      clearLoadingMessage();
      phaseOneSources();
    }, 1000);
  }
}

/* Display a loading message */
function displayLoadingMessage(text) {
  const loadingBubble = document.createElement("div");
  loadingBubble.classList.add("message-bubble", "bot-response", "loading");
  loadingBubble.innerText = text;
  chatBox.appendChild(loadingBubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* Clear the loading message */
function clearLoadingMessage() {
  const loadingBubble = document.querySelector(".loading");
  if (loadingBubble) {
    loadingBubble.remove();
  }
}

/* Phase 1: Show a set of 3 placeholder sources in a box */
function phaseOneSources() {
  const sources = [
    "Source 1: Placeholder Source A",
    "Source 2: Placeholder Source B",
    "Source 3: Placeholder Source C"
  ];

  const messageBubble = document.createElement("div");
  messageBubble.classList.add("message-bubble", "bot-response", "box");
  messageBubble.innerHTML = "<b>Sources:</b><br>" + sources.join("<br>");
  chatBox.appendChild(messageBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Save to current chat
  currentChat.push({ sender: "bot", text: messageBubble.innerHTML });

  // Phase 2: Show loading while processing facts
  displayLoadingMessage("Extracting facts from articles...");
  setTimeout(() => {
    clearLoadingMessage();
    phaseTwoFacts();
  }, 1000);
}

/* Phase 2: Show a set of 10 placeholder facts in a box */
function phaseTwoFacts() {
  const facts = [
    "Fact 1: Placeholder fact from Source A",
    "Fact 2: Placeholder fact from Source B",
    "Fact 3: Placeholder fact from Source C",
    "Fact 4: Placeholder fact from Source A",
    "Fact 5: Placeholder fact from Source B",
    "Fact 6: Placeholder fact from Source C",
    "Fact 7: Placeholder fact from Source A",
    "Fact 8: Placeholder fact from Source B",
    "Fact 9: Placeholder fact from Source C",
    "Fact 10: Placeholder fact from Source A"
  ];

  const messageBubble = document.createElement("div");
  messageBubble.classList.add("message-bubble", "bot-response", "box");
  messageBubble.innerHTML = "<b>Facts Extracted:</b><br>" + facts.join("<br>");
  chatBox.appendChild(messageBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Save to current chat
  currentChat.push({ sender: "bot", text: messageBubble.innerHTML });

  // Phase 3: Show loading while preparing synthesis
  displayLoadingMessage("Generating synthesis...");
  setTimeout(() => {
    clearLoadingMessage();
    phaseThreeSynthesis();
  }, 1000);
}

/* Phase 3: Stream the synthesis response (lipsum text) in a box */
function phaseThreeSynthesis() {
  const lipsumText = generateLipsum();

  const messageBubble = document.createElement("div");
  messageBubble.classList.add("message-bubble", "bot-response", "box");
  chatBox.appendChild(messageBubble);

  let index = 0;
  const chunkSize = 10; // Stream 10 characters at a time

  const intervalId = setInterval(() => {
    if (index < lipsumText.length) {
      messageBubble.innerHTML += lipsumText.slice(index, index + chunkSize);
      index += chunkSize;
      chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    } else {
      clearInterval(intervalId);
      // Save to current chat
      currentChat.push({ sender: "bot", text: messageBubble.innerHTML });
      saveChat();
    }
  }, 50); // 0.05 seconds per chunk
}

/* Generate a lipsum-like placeholder text */
function generateLipsum() {
  return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
}

/* Save the current chat session and reset */
function saveChat() {
  chats.push(currentChat);
  currentChat = [];  // Reset current chat for new conversation
  chatCount++;
  updateSidebar();
}

/* Update the sidebar with saved chats */
function updateSidebar() {
  const chatList = document.createElement("ul");
  chatList.innerHTML = "";  // Clear previous chat list

  chats.forEach((chat, index) => {
    const listItem = document.createElement("li");
    listItem.innerText = `Chat ${index + 1}`;
    listItem.addEventListener("click", () => displayChat(index));
    chatList.appendChild(listItem);
  });

  sidebar.innerHTML = "";  // Clear previous content
  sidebar.appendChild(chatList);
}

/* Display a selected chat */
function displayChat(chatIndex) {
  chatBox.innerHTML = "";  // Clear current chat

  const selectedChat = chats[chatIndex];
  selectedChat.forEach((message) => {
    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message-bubble", message.sender === "user" ? "user-message" : "bot-response");
    messageBubble.innerHTML = message.text;
    chatBox.appendChild(messageBubble);
  });

  chatBox.scrollTop = chatBox.scrollHeight;  // Auto-scroll to the bottom
}

/* Start a new chat session */
function startNewChat() {
  if (currentChat.length > 0) {
    saveChat();  // Save current chat before starting a new one
  }

  chatBox.innerHTML = "";  // Clear the chat box
  currentChat = [];  // Reset the current chat session
}

/* Optional: Send message on Enter key */
chatInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
