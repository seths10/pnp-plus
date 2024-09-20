chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.sendMessage(activeInfo.tabId, { action: "checkForVideo" });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enterPiP") {
    chrome.tabs.sendMessage(sender.tab.id, { action: "enterPiP" });
  } else if (request.action === "exitPiP") {
    chrome.tabs.sendMessage(sender.tab.id, { action: "exitPiP" });
  }
});