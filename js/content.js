let video;
let pipWindow;
let controlsContainer;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkForVideo") {
    video = document.querySelector('video');
    if (video && !document.pictureInPictureElement) {
      chrome.runtime.sendMessage({ action: "enterPiP" });
    }
  } else if (request.action === "enterPiP") {
    enterPictureInPicture();
  } else if (request.action === "exitPiP") {
    exitPictureInPicture();
  }
});

async function enterPictureInPicture() {
  if (!video) return;

  try {
    pipWindow = await video.requestPictureInPicture();
    createPiPControls();
  } catch (error) {
    console.error("Failed to enter Picture-in-Picture mode:", error);
  }
}

function exitPictureInPicture() {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  }
}

function createPiPControls() {
  controlsContainer = document.createElement('div');
  controlsContainer.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    padding: 5px;
    border-radius: 5px;
    display: none;
  `;

  const playPauseBtn = createButton('Play/Pause', togglePlayPause);
  const skipBackBtn = createButton('-10s', () => video.currentTime -= 10);
  const skipForwardBtn = createButton('+30s', () => video.currentTime += 30);
  const exitBtn = createButton('Exit', exitPictureInPicture);
  const popBackBtn = createButton('Pop Back', popBackToTab);

  controlsContainer.append(playPauseBtn, skipBackBtn, skipForwardBtn, exitBtn, popBackBtn);
  pipWindow.addEventListener('mouseover', () => controlsContainer.style.display = 'block');
  pipWindow.addEventListener('mouseout', () => controlsContainer.style.display = 'none');

  document.body.appendChild(controlsContainer);
}

function createButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

function togglePlayPause() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function popBackToTab() {
  exitPictureInPicture();
  chrome.runtime.sendMessage({ action: "focusOriginalTab" });
}

// Clean up when leaving Picture-in-Picture mode
video.addEventListener('leavepictureinpicture', () => {
  if (controlsContainer) {
    controlsContainer.remove();
    controlsContainer = null;
  }
});