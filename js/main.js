let currentScene = 1;
let currentAd = 1;
let hasPlayedStatic = false;
const totalScenes = 2;
const totalAds = 2;

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
        titleElem.remove(); // <-- remove the intro title here
        loadScene(currentScene, contentElem, 40);
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
      toggleTheme();

      if (!hasPlayedStatic) {
        hasPlayedStatic = true;
        setTimeout(() => {
          const audio = new Audio("audio/static_intro.wav");
          audio.play();
        }, 300);
      }
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

function playVoice(text) {
  const stripped = text.replace(/<[^>]+>/g, "");
  const utterance = new SpeechSynthesisUtterance(stripped);
  utterance.rate = 0.8;
  utterance.pitch = 1;
  utterance.volume = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function cycleAd() {
  currentAd = currentAd % totalAds + 1;
  loadAd(currentAd);
}

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

  runIntroSequence();
});

let input = "";
const konami = "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba";

window.addEventListener("keydown", (e) => {
  input += e.key;
  if (input.includes(konami)) {
    document.querySelector('link[rel=stylesheet]').href = "css/03.css";
    input = "";
  }
});

const themeNum = Math.floor(Math.random() * 4) + 1;
document.querySelector('link[rel=stylesheet]').href = `css/0${themeNum}.css`;

document.getElementById("theme-switcher")?.addEventListener("change", (e) => {
  const theme = e.target.value;
  const link = document.querySelector('link[rel=stylesheet]');
  link.href = `css/0${theme}.css`;
});
