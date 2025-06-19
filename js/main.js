let currentScene = 1;

function loadScene(sceneNum) {
  const fileName = sceneNum < 10 ? `0${sceneNum}` : `${sceneNum}`;
  const path = `xml/${fileName}.xml`;

  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error("Scene not found");
      return response.text();
    })
    .then(xmlString => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, "text/xml");
      const content = xml.getElementsByTagName("content")[0]?.textContent || "";
      document.getElementById("scene-container").innerHTML = content || "<p class='presence'>You are here.</p>";
      animateSceneText(document.getElementById("scene-container"));
      playVoice(content);
      currentScene = sceneNum;
    })
    .catch(() => {
      document.getElementById("scene-container").innerHTML = "<p class='presence'>You are here.</p>";
    });
}

function animateSceneText(container) {
  const letters = container.innerText.split("");
  container.innerHTML = "";
  letters.forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.opacity = 0;
    span.style.transition = `opacity 0.05s ease ${i * 20}ms`;
    container.appendChild(span);
  });
  requestAnimationFrame(() => {
    container.querySelectorAll("span").forEach(span => {
      span.style.opacity = 1;
    });
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
  const stripped = text.replace(/<[^>]+>/g, ""); // Remove HTML tags
  const utterance = new SpeechSynthesisUtterance(stripped);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 0.9;
  speechSynthesis.cancel(); // Cancel any ongoing speech
  speechSynthesis.speak(utterance);
}

document.addEventListener("DOMContentLoaded", () => {
  if (Math.random() > 0.5) {
    document.body.classList.add("dark-mode");
  }

  document.getElementById("prev-scene").addEventListener("click", () => {
    if (currentScene > 1) {
      toggleTheme();
      loadScene(currentScene - 1);
    }
  });

  document.getElementById("next-scene").addEventListener("click", () => {
    toggleTheme();
    loadScene(currentScene + 1);
  });

  loadScene(currentScene);
});
