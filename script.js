// script.js
let chats = [];  // Array to store all chat sessions
let currentChat = [];  // Array to store the current chat
let chatCount = 0;  // Track the number of chats
let isRightSidebarVisible = false;  // Track the visibility of the right sidebar

const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const sidebar = document.getElementById("sidebar");
const newChatButton = document.getElementById("new-chat-button");
const toggleSidebarButton = document.getElementById("toggle-sidebar");
const rightSidebar = document.getElementById("right-sidebar");
const rightSidebarClose = document.getElementById("close-right-sidebar");
const sourceList = document.getElementById("source-list");

sendButton.addEventListener("click", sendMessage);
newChatButton.addEventListener("click", startNewChat);
toggleSidebarButton.addEventListener("click", toggleSidebar);
rightSidebarClose.addEventListener("click", toggleRightSidebar);

function toggleSidebar() {
  sidebar.classList.toggle("hidden");
  document.querySelector(".chat-area").classList.toggle("expanded");
}

function toggleRightSidebar() {
  isRightSidebarVisible = !isRightSidebarVisible;
  if (isRightSidebarVisible) {
    rightSidebar.classList.add("visible");
    showAllSources(); // Show all sources in the right sidebar when it becomes visible
  } else {
    rightSidebar.classList.remove("visible");
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

/* Phase 1: Show a set of 10 placeholder sources in a box and select 3 of them */
function phaseOneSources() {
  const allSources = [
    "Source 1: Placeholder Source A",
    "Source 2: Placeholder Source B",
    "Source 3: Placeholder Source C",
    "Source 4: Placeholder Source D",
    "Source 5: Placeholder Source E",
    "Source 6: Placeholder Source F",
    "Source 7: Placeholder Source G",
    "Source 8: Placeholder Source H",
    "Source 9: Placeholder Source I",
    "Source 10: Placeholder Source J"
  ];

  // Select 3 sources from the list of 10
  const sources = [
    allSources[0],
    allSources[3],
    allSources[6]
  ];

  const messageBubble = document.createElement("div");
  messageBubble.classList.add("message-bubble", "bot-response", "box");
  messageBubble.innerHTML = "<b>Sources:</b><br>" + sources.join("<br>");

  // Add the button to open the right sidebar, position it to the right of the Phase 1 box
  const button = document.createElement("button");
  button.classList.add("view-sources-button");
  button.innerText = "View Sources";
  button.addEventListener("click", toggleRightSidebar);
  button.style.marginLeft = "10px";  // Add some space between the box and the button

  const container = document.createElement("div");
  container.classList.add("phase-container");
  container.style.display = "flex";  // Use flex to align the button to the right of the box
  container.style.alignItems = "center";  // Vertically align items
  container.appendChild(messageBubble);
  container.appendChild(button);

  chatBox.appendChild(container);
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

/* Show all sources in the right sidebar and make them selectable */
function showAllSources() {
  const allSources = [
    "Source 1: Placeholder Source A",
    "Source 2: Placeholder Source B",
    "Source 3: Placeholder Source C",
    "Source 4: Placeholder Source D",
    "Source 5: Placeholder Source E",
    "Source 6: Placeholder Source F",
    "Source 7: Placeholder Source G",
    "Source 8: Placeholder Source H",
    "Source 9: Placeholder Source I",
    "Source 10: Placeholder Source J"
  ];

  sourceList.innerHTML = "";  // Clear the previous list

  allSources.forEach((source, index) => {
    const listItem = document.createElement("li");
    listItem.innerText = source;
    listItem.classList.add("selectable-source");
    listItem.addEventListener("click", () => selectSource(source));
    sourceList.appendChild(listItem);
  });
}

/* Function to handle source selection from the right sidebar */
function selectSource(selectedSource) {
  // Update the Phase 1 sources box with the selected source
  const sourcesBox = document.querySelector(".phase-container .box");
  if (sourcesBox) {
    sourcesBox.innerHTML += `<br>${selectedSource}`;
  }
  // Save the updated sources to the current chat
  currentChat.push({ sender: "bot", text: sourcesBox.innerHTML });
}

/* Phase 2: Show a set of 10 placeholder facts in a box and add a button to insert new facts */
function phaseTwoFacts() {
  let facts = [
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

  // Add button to insert new facts
  const insertFactButton = document.createElement("button");
  insertFactButton.classList.add("insert-fact-button");
  insertFactButton.innerText = "Insert New Fact";
  insertFactButton.style.marginLeft = "10px";  // Add some space between the box and the button
  insertFactButton.style.alignSelf = "center";  // Center the button vertically
  insertFactButton.addEventListener("click", () => {
    const newFact = prompt("Enter a new fact:");
    if (newFact) {
      facts.push(newFact);
      messageBubble.innerHTML = "<b>Facts Extracted:</b><br>" + facts.join("<br>");
      currentChat.push({ sender: "bot", text: messageBubble.innerHTML }); // Update current chat
    }
  });

  const container = document.createElement("div");
  container.classList.add("phase-container");
  container.style.display = "flex";  // Use flex to align items
  container.style.alignItems = "center";  // Align items at the center vertically
  container.appendChild(messageBubble);
  container.appendChild(insertFactButton);

  chatBox.appendChild(container);
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

/* Start a new chat session */
function startNewChat() {
  if (currentChat.length > 0) {
    saveChat();  // Save current chat before starting a new one
  }

  chatBox.innerHTML = "";  // Clear the chat box
  currentChat = [];  // Reset the current chat session

  // Reset the right sidebar visibility
  if (isRightSidebarVisible) {
    toggleRightSidebar();
  }
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
  const chatList = document.getElementById("chat-list");
  chatList.innerHTML = "";  // Clear previous chat list

  chats.forEach((chat, index) => {
    const listItem = document.createElement("li");
    listItem.innerText = `Chat ${index + 1}`;
    listItem.addEventListener("click", () => displayChat(index));
    chatList.appendChild(listItem);
  });
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
  chatBox.scrollTop = chatBox.scrollHeight;
}
