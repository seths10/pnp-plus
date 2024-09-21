let video;
let pipWindow;
let controlsContainer;

function findVideo() {
  const videos = document.querySelectorAll('video');
  console.log(`Found ${videos.length} video element(s) on the page`);
  return videos.length > 0 ? videos[0] : null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`Received message with action: ${request.action}`);
  if (request.action === "checkForVideo") {
    video = findVideo();
    if (video && !document.pictureInPictureElement) {
      enterPictureInPicture();
    } else {
      console.log("No suitable video found or already in PiP mode");
    }
  } else if (request.action === "enterPiP") {
    enterPictureInPicture();
  } else if (request.action === "exitPiP") {
    exitPictureInPicture();
  } else if (request.action === "togglePiP") {
    togglePictureInPicture();
  }
});

async function enterPictureInPicture() {
  if (!video) {
    video = findVideo();
    if (!video) {
      console.error("No video element found");
      return;
    }
  }

  try {
    if (document.pictureInPictureElement) {
      console.log("Already in PiP mode, exiting first");
      await document.exitPictureInPicture();
    }
    console.log("Attempting to enter PiP mode");
    pipWindow = await video.requestPictureInPicture();
    console.log("Successfully entered PiP mode");
    createPiPControls();
  } catch (error) {
    console.error("Failed to enter Picture-in-Picture mode:", error);
    if (error.name === 'NotAllowedError') {
      console.error("PiP not allowed. This could be due to the video element's configuration or browser settings.");
    } else if (error.name === 'NotSupportedError') {
      console.error("PiP not supported in this browser or for this video.");
    }
    // Check if PiP is supported by the browser
    if (document.pictureInPictureEnabled) {
      console.log("PiP is supported by the browser");
    } else {
      console.error("PiP is not supported by this browser");
    }
    // Check if the video can enter PiP mode
    if (video.disablePictureInPicture) {
      console.error("PiP is disabled for this video");
    }
  }
}

function exitPictureInPicture() {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
    console.log("Exited PiP mode");
  } else {
    console.log("Not in PiP mode, nothing to exit");
  }
}

function togglePictureInPicture() {
  console.log("Toggling PiP mode");
  if (document.pictureInPictureElement) {
    exitPictureInPicture();
  } else {
    enterPictureInPicture();
  }
}

// ... (rest of the code remains the same)

// Log when the content script is loaded
console.log("Picture-in-Picture content script loaded");