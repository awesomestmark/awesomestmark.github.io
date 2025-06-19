let currentScene = 1;
let currentAd = 1;
const totalAds = 2;

function loadScene(sceneNum) {
  const fileName = sceneNum < 10 ? `0${sceneNum}` : `${sceneNum}`;
  const path = `xml/${fileName}.xml`;

  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error(`Scene ${fileName}.xml not found`);
      return response.text();
    })
    .then(xmlString => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, "text/xml");
      const content = xml.getElementsByTagName("content")[0]?.textContent || "";

      document.getElementById("scene-container").innerHTML = content;
      animateSceneText(document.getElementById("scene-container"));
      playVoice(content);

      // ✅ only set currentScene *after* successful load
      currentScene = sceneNum;

      // 🎯 now also rotate ads independently
      cycleAd();
      toggleTheme();
    })
    .catch((err) => {
      console.error("Scene load error:", err);
      document.getElementById("scene-container").innerHTML = `
        <p style="color:red;">❌ Scene could not load.</p>
        <p class="subtext">You are here.</p>`;
    });
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
  utterance.rate = 1;
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
  // Random dark/light start
  if (Math.random() > 0.5) document.body.classList.add("dark-mode");

  document.getElementById("prev-scene").addEventListener("click", () => {
    if (currentScene > 1) {
      loadScene(currentScene - 1);
    }
  });

  document.getElementById("next-scene").addEventListener("click", () => {
    loadScene(currentScene + 1);
  });

  loadScene(currentScene);
  loadAd(currentAd);
});