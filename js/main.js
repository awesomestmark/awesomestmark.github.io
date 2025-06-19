let currentScene = 1;
let currentAd = 1;
const totalScenes = 2; // You currently only have 2 scene files
const totalAds = 2;

// Intro animation
function runIntroSequence() {
  const container = document.getElementById("scene-container");
  const audio = new Audio("audio/static_intro.wav");

  const title = "WELCOME TO THE INTERNET";
  container.innerHTML = "";
  container.classList.add("intro");

  audio.play();

  let i = 0;
  const interval = setInterval(() => {
    container.textContent += title[i];
    i++;
    if (i >= title.length) {
      clearInterval(interval);
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        container.innerHTML = `<h1>${title}</h1><div id="main-content"></div>`;
        container.classList.remove("intro");
        loadScene(currentScene);
      }, 1000); // 1 second pause
    }
  }, 100); // slower typewriter for dramatic intro
}

// Load scene content
function loadScene(sceneNum) {
  if (sceneNum < 1 || sceneNum > totalScenes) return;

  const fileName = sceneNum < 10 ? `0${sceneNum}` : `${sceneNum}`;
  const path = `xml/${fileName}.xml`;
  const container = document.getElementById("main-content") || document.getElementById("scene-container");

  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error(`Scene ${fileName}.xml not found (${response.status})`);
      return response.text();
    })
    .then(xmlString => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, "text/xml");
      const content = xml.getElementsByTagName("content")[0]?.textContent || "";

      container.innerHTML = ""; // Clear before animation
      animateSceneText(container, content);

      currentScene = sceneNum;
      cycleAd();
      toggleTheme();
    })
    .catch((err) => {
      container.innerHTML = `
        <p style="color:red; font-weight:bold;">❌ Failed to load: xml/${fileName}.xml</p>
        <p style="font-size: 0.9rem;">${err.message}</p>
      `;
      console.error("Scene load error:", err);
    });
}

// Typewriter text animation
function animateSceneText(container, html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const fullText = temp.textContent || temp.innerText || "";
  container.innerHTML = "";

  let i = 0;
  const interval = setInterval(() => {
    container.textContent += fullText[i];
    i++;
    if (i >= fullText.length) {
      clearInterval(interval);
      container.innerHTML = html;
    }
  }, 20);
}

// Load rotating ad
function loadAd(adNum) {
  const path = `ads/0${adNum}.xml`;

  fetch(path)
    .then(response => response.text())
    .then(xmlString => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, "text/xml");
      const content = xml.getElementsByTagName("content")[0]?.textContent || "";
      document.getElementById("ad-container").innerHTML = content;
    });
}

// Fade overlay for dark/light mode switch
function toggleTheme() {
  const overlay = document.createElement("div");
  overlay.className = "fade-overlay";
  document.body.appendChild(overlay);

  overlay.classList.add("active");
  setTimeout(() => {
    document.body.classList.toggle("dark-mode");
    overlay.classList.remove("active");
    setTimeout(() => {
      overlay.remove();
    }, 500);
  }, 250);
}

// Voice function (currently unused, saved for future)
function playVoice(text) {
  const stripped = text.replace(/<[^>]+>/g, "");
  const utterance = new SpeechSynthesisUtterance(stripped);
  utterance.rate = 0.8;
  utterance.pitch = 1;
  utterance.volume = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

// Ad rotator
function cycleAd() {
  currentAd = currentAd % totalAds + 1;
  loadAd(currentAd);
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  if (Math.random() > 0.5) document.body.classList.add("dark-mode");

  document.getElementById("prev-scene").addEventListener("click", () => {
    if (currentScene > 1) {
      loadScene(currentScene - 1);
    }
  });

  document.getElementById("next-scene").addEventListener("click", () => {
    if (currentScene < totalScenes) {
      loadScene(currentScene + 1);
    }
  });

  runIntroSequence(); // Start the intro first
});
