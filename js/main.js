console.log("main.js loaded");

const totalScenes = 2;
const totalAds = 3;
let currentScene = 1;
let currentAd = 1;
let hasPlayedStatic = false;
const themeCssFiles = ["css/01.css", "css/02.css", "css/03.css", "css/04.css"];

// Load random theme CSS on page load
function loadRandomTheme() {
  const randomIndex = Math.floor(Math.random() * themeCssFiles.length);
  const themePath = themeCssFiles[randomIndex];
  let linkTag = document.getElementById("theme-style");

  if (!linkTag) {
    linkTag = document.createElement("link");
    linkTag.rel = "stylesheet";
    linkTag.id = "theme-style";
    document.head.appendChild(linkTag);
  }

  linkTag.href = themePath;
  console.log("Loaded theme CSS:", themePath);
}

document.addEventListener("DOMContentLoaded", () => {
  loadRandomTheme();

  runIntroSequence();

  // Setup nav buttons
  document.getElementById("prev-scene").addEventListener("click", () => {
    let newScene = currentScene - 1;
    if (newScene < 1) newScene = totalScenes;
    loadScene(newScene);
  });

  document.getElementById("next-scene").addEventListener("click", () => {
    let newScene = currentScene + 1;
    if (newScene > totalScenes) newScene = 1;
    loadScene(newScene);
  });
});

function runIntroSequence() {
  const container = document.getElementById("scene-container");
  container.innerHTML = "";

  const audio = new Audio("audio/static_intro.wav");

  const titleElem = document.createElement("div");
  titleElem.className = "intro-title";
  container.appendChild(titleElem);

  const contentElem = document.createElement("div");
  contentElem.id = "main-content";
  contentElem.className = "typewriter-container";
  container.appendChild(contentElem);

  const titleText = "WELCOME TO THE INTERNET";
  let i = 0;
  audio.play();

  const interval = setInterval(() => {
    titleElem.textContent += titleText[i];
    i++;
    if (i >= titleText.length) {
      clearInterval(interval);
      setTimeout(() => {
        titleElem.remove();
        loadScene(currentScene, contentElem, 40);
        loadAd(currentAd);
      }, 1000);
    }
  }, 150);
}

function loadScene(sceneNum, containerOverride = null, speedOverride = 20) {
  if (sceneNum < 1 || sceneNum > totalScenes) return;

  const fileName = sceneNum < 10 ? `0${sceneNum}` : `${sceneNum}`;
  const path = `xml/${fileName}.xml`;
  const container = containerOverride || document.getElementById("main-content") || document.getElementById("scene-container");

  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error(`Scene ${fileName}.xml not found (${response.status})`);
      return response.text();
    })
    .then(xmlString => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, "text/xml");
      const content = xml.getElementsByTagName("content")[0]?.textContent || "";

      container.innerHTML = "";
      animateSceneText(container, content, speedOverride);
      currentScene = sceneNum;

      cycleAd();
      // Optionally switch theme on scene change:
      // loadRandomTheme();
    })
    .catch((err) => {
      container.innerHTML = `
        <p style="color:red; font-weight:bold;">❌ Failed to load: xml/${fileName}.xml</p>
        <p style="font-size: 0.9rem;">${err.message}</p>
      `;
      console.error("Scene load error:", err);
    });
}

function animateSceneText(container, html, speed = 20) {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const fullText = temp.textContent || temp.innerText || "";
  container.classList.add("typewriter-text");
  container.innerHTML = "";

  let i = 0;
  const interval = setInterval(() => {
    container.textContent += fullText[i];
    i++;
    if (i >= fullText.length) {
      clearInterval(interval);
      container.innerHTML = html;
      container.classList.remove("typewriter-text");
    }
  }, speed);
}

function loadAd(adNum) {
  if (adNum < 1 || adNum > totalAds) return;
  const fileName = adNum < 10 ? `0${adNum}` : `${adNum}`;
  const path = `ads/${fileName}.xml`;
  const adContainer = document.getElementById("ad-container");
  console.log(`Loading ad file: ${path}`);

  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error(`Ad ${fileName}.xml not found (${response.status})`);
      return response.text();
    })
    .then(xmlString => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, "text/xml");
      const contentElem = xml.getElementsByTagName("content")[0];
      if (!contentElem) throw new Error("No <content> tag found in ad XML");
      const content = contentElem.textContent || "";

      adContainer.innerHTML = content;

      applyAdTheme(adContainer);
      setupAdEventListeners(adContainer);

      currentAd = adNum;
    })
    .catch((err) => {
      adContainer.innerHTML = `
        <p style="color:red; font-weight:bold;">❌ Failed to load: ads/${fileName}.xml</p>
        <p style="font-size: 0.9rem;">${err.message}</p>
      `;
      console.error("Ad load error:", err);
    });
}

// Cycle ad for next scene load
function cycleAd() {
  currentAd++;
  if (currentAd > totalAds) currentAd = 1;
  loadAd(currentAd);
}

function applyAdTheme(adContainer) {
  const stylesheet = document.getElementById("theme-style")?.href || "";
  const adBox = adContainer.querySelector('.ad-box');
  if (!adBox) return;

  adBox.classList.remove('theme-01', 'theme-02', 'theme-03', 'theme-04', 'dark-mode');

  if (stylesheet.includes('css/01.css')) {
    adBox.classList.add('theme-01');
    if (document.body.classList.contains('dark-mode')) {
      adBox.classList.add('dark-mode');
    }
  } else if (stylesheet.includes('css/02.css')) {
    adBox.classList.add('theme-02');
  } else if (stylesheet.includes('css/03.css')) {
    adBox.classList.add('theme-03');
  } else if (stylesheet.includes('css/04.css')) {
    adBox.classList.add('theme-04');
  }
}

function setupAdEventListeners(adContainer) {
  const freebitcoinAd = adContainer.querySelector('.freebitcoin-ad');
  if (freebitcoinAd) {
    freebitcoinAd.addEventListener('click', () => {
      console.log('FreeBitcoin ad clicked!');
    });
  }

  const referralButton = adContainer.querySelector('.referral-button');
  if (referralButton) {
    referralButton.addEventListener('click', () => {
      console.log('Referral link clicked!');
    });
  }
}
