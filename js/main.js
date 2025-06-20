let currentScene = 1;

function runIntroSequence() {
  const overlay = document.getElementById("intro-overlay");
  overlay.innerHTML = "";
  overlay.style.display = "flex"; // Ensure overlay is visible

  // Static Sound Setup
  const audio = new Audio("audio/static_intro.wav");

  // Create title element (big bold intro)
  const titleElem = document.createElement("div");
  titleElem.className = "intro-title";
  overlay.appendChild(titleElem);

  // Type "WELCOME TO THE INTERNET"
  const titleText = "WELCOME TO THE INTERNET";
  let i = 0;
  audio.play();

  const interval = setInterval(() => {
    titleElem.textContent += titleText[i];
    i++;
    if (i >= titleText.length) {
      clearInterval(interval);
      setTimeout(() => {
        // Fade out the overlay
        overlay.classList.add("hidden");
        setTimeout(() => {
          overlay.innerHTML = "";
          overlay.style.display = "none";
          // Load the first scene into scene-container
          loadScene(currentScene, document.getElementById("scene-container"), 40);
        }, 500); // Match CSS transition duration
      }, 1000);
    }
  }, 150);
}

function loadScene(sceneNum, container, typingSpeed = 40) {
  const sceneUrl = `xml/0${sceneNum}.xml`;
  fetch(sceneUrl)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const content = xmlDoc.querySelector("content").textContent;
      typeScene(content, container, typingSpeed);
      // Load ad content
      loadAd(sceneNum);
    })
    .catch((error) => console.error("Error loading scene:", error));
}

function typeScene(content, container, typingSpeed) {
  container.innerHTML = "";
  const contentWrapper = document.createElement("div");
  contentWrapper.id = "main-content";
  container.appendChild(contentWrapper);

  let i = 0;
  const interval = setInterval(() => {
    contentWrapper.textContent += content[i];
    i++;
    if (i >= content.length) {
      clearInterval(interval);
      // Setup navigation after content is loaded
      setupNavigation();
    }
  }, typingSpeed);
}

function loadAd(sceneNum) {
  const adContainer = document.getElementById("ad-container");
  const adUrl = `ads/0${sceneNum}.xml`;
  fetch(adUrl)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const adContent = xmlDoc.querySelector("content").textContent;
      adContainer.innerHTML = adContent;
    })
    .catch((error) => console.error("Error loading ad:", error));
}

function setupNavigation() {
  const navLeft = document.getElementById("nav-left");
  const navRight = document.getElementById("nav-right");

  navLeft.innerHTML = "";
  navRight.innerHTML = "";

  if (currentScene > 1) {
    const leftArrow = document.createElement("div");
    leftArrow.className = "nav-arrow";
    leftArrow.innerHTML = `<svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>`;
    leftArrow.addEventListener("click", () => {
      currentScene--;
      loadScene(currentScene, document.getElementById("scene-container"));
    });
    navLeft.appendChild(leftArrow);
  }

  if (currentScene < 2) {
    const rightArrow = document.createElement("div");
    rightArrow.className = "nav-arrow";
    rightArrow.innerHTML = `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>`;
    rightArrow.addEventListener("click", () => {
      currentScene++;
      loadScene(currentScene, document.getElementById("scene-container"));
    });
    navRight.appendChild(rightArrow);
  }
}

// Set default theme to 03.css (cyberpunk)
document.querySelector('link[rel=stylesheet]').href = `css/03.css`;

// Start the intro sequence
runIntroSequence();
