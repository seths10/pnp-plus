document.addEventListener('DOMContentLoaded', function() {
  const togglePiPButton = document.getElementById('togglePiP');

  if (togglePiPButton) {
    togglePiPButton.addEventListener('click', () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "togglePiP"}, function(response) {
            if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError.message);
            } else {
              console.log("Message sent successfully");
            }
          });
        } else {
          console.error("No active tab found");
        }
      });
    });
  } else {
    console.error('Toggle PiP button not found');
  }
});

// Log when the popup script is loaded
console.log("Picture-in-Picture popup script loaded");