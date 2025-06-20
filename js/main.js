document.addEventListener("DOMContentLoaded", () => {
  const themeId = Math.floor(Math.random() * 4) + 1;
  document.getElementById("theme-link").href = `css/0${themeId}.css`;

  runIntroSequence();

  document.getElementById("prev-scene").addEventListener("click", () => {
    if (currentScene > 1) loadScene(currentScene - 1);
  });

  document.getElementById("next-scene").addEventListener("click", () => {
    if (currentScene < totalScenes) loadScene(currentScene + 1);
  });
});

let currentScene = 1;
let currentAd = 1;
let hasPlayedStatic = false;
const totalScenes = 2;
const totalAds = 3;

function runIntroSequence() {
  const container = document.getElementById("scene-container");
  container.innerHTML = "";

  const audio = new Audio("audio/static_intro.wav");

  const titleElem = document.createElement("div");
  titleElem.className = "intro-title";
  titleElem.textContent = "";
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
    })
    .catch(err => {
      container.innerHTML = `<p style="color:red;">❌ Failed to load: xml/${fileName}.xml</p>`;
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

function cycleAd() {
  const adPath = `ads/0${currentAd}.xml`;
  fetch(adPath)
    .then(response => response.text())
    .then(xml => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "text/xml");
      const content = doc.querySelector("content").textContent;
      document.getElementById("ad-container").innerHTML = content;
      currentAd = (currentAd % totalAds) + 1;
    })
    .catch(err => {
      document.getElementById("ad-container").innerHTML = `<p style="color:red;">❌ Ad load failed</p>`;
      console.error("Ad load error:", err);
    });
}
