chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.sendMessage(activeInfo.tabId, { action: "checkForVideo" });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enterPiP" || request.action === "exitPiP" || request.action === "togglePiP") {
    chrome.tabs.sendMessage(sender.tab.id, request);
  } else if (request.action === "focusOriginalTab") {
    chrome.tabs.update(sender.tab.id, { active: true });
  }
});

// Log when the background script is loaded
console.log("Picture-in-Picture background script loaded");