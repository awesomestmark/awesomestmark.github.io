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
        titleElem.remove();
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
      const xml = parse
