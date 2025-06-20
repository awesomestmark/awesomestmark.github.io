console.log("main.js loaded");

const totalScenes = 2;  // update if more scenes exist
const totalAds = 3;     // update if more ads exist

let currentScene = 1;
let currentAd = 1;
let hasPlayedStatic = false;

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  loadRandomTheme();
  loadAd(currentAd);
  loadScene(currentScene);

  document.getElementById("next-scene").addEventListener("click", () => {
    currentScene = currentScene >= totalScenes ? 1 : currentScene + 1;
    loadScene(currentScene);
    currentAd = currentAd >= totalAds ? 1 : currentAd + 1;
    loadAd(currentAd);
  });

  document.getElementById("prev-scene").addEventListener("click", () => {
    currentScene = currentScene <= 1 ? totalScenes : currentScene - 1;
    loadScene(currentScene);
    currentAd = currentAd <= 1 ? totalAds : currentAd - 1;
    loadAd(currentAd);
  });
});

function loadRandomTheme() {
  const themeNumber = Math.floor(Math.random() * 4) + 1; // 1 to 4
  const linkId = "theme-style";
  let themeLink = document.getElementById(linkId);

  if (!themeLink) {
    themeLink = document.createElement("link");
    themeLink.rel = "stylesheet";
    themeLink.id = linkId;
    document.head.appendChild(themeLink);
  }

  themeLink.href = `css/0${themeNumber}.css`;
  console.log("Theme loaded:", themeLink.href);
}

function loadScene(sceneNum) {
  const sceneContainer = document.getElementById("scene-container");
  const fileName = sceneNum < 10 ? `0${sceneNum}` : `${sceneNum}`;
  const url = `xml/${fileName}.xml`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Could not load ${url} - Status: ${res.status}`);
      return res.text();
    })
    .then((xmlText) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "text/xml");
      const content = xml.querySelector("content").textContent || "";
      sceneContainer.innerHTML = content;
      console.log(`Scene ${sceneNum} loaded.`);
    })
    .catch((err) => {
      sceneContainer.innerHTML = `<p style="color:red;">Error loading scene: ${err.message}</p>`;
      console.error(err);
    });
}

function loadAd(adNum) {
  const adContainer = document.getElementById("ad-container");
  const fileName = adNum < 10 ? `0${adNum}` : `${adNum}`;
  const url = `ads/${fileName}.xml`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Could not load ${url} - Status: ${res.status}`);
      return res.text();
    })
    .then((xmlText) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "text/xml");
      const content = xml.querySelector("content").textContent || "";
      adContainer.innerHTML = content;
      console.log(`Ad ${adNum} loaded.`);
    })
    .catch((err) => {
      adContainer.innerHTML = `<p style="color:red;">Error loading ad: ${err.message}</p>`;
      console.error(err);
    });
}
