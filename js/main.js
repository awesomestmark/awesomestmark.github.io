console.log("main.js loaded");
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  runIntroSequence();
  document.getElementById("prev-scene").addEventListener("click", () => loadScene(currentScene - 1));
  document.getElementById("next-scene").addEventListener("click", () => loadScene(currentScene + 1));
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
      }, 800);
    }
  }, 100);
}

function loadScene(sceneNum, containerOverride = null, speedOverride = 20) {
  if (sceneNum < 1 || sceneNum > totalScenes) return;

  const fileName = sceneNum < 10 ? `0${sceneNum}` : `${sceneNum}`;
  const path = `xml/${fileName}.xml`;
  const container = containerOverride || document.getElementById("main-content") || document.getElementById("scene-container");

  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error(`Scene ${fileName}.xml not found`);
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
    .catch((err) => {
      container.innerHTML = `<p style="color:red;">❌ Failed to load: ${fileName}.xml</p>`;
      console.error(err);
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
    .then(xmlString => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, "text/xml");
      const adContent = xml.getElementsByTagName("content")[0]?.textContent || "";
      document.getElementById("ad-container").innerHTML = adContent;
      currentAd = (currentAd % totalAds) + 1;
    })
    .catch(err => {
      document.getElementById("ad-container").innerHTML = `<p style="color:red;">Ad failed</p>`;
      console.error(err);
    });
}
