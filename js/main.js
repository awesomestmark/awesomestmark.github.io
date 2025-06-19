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

document.getElementById("prev-scene").addEventListener("click", () => {
  if (currentScene > 1) loadScene(currentScene - 1);
});

document.getElementById("next-scene").addEventListener("click", () => {
  loadScene(currentScene + 1);
});

// Load first scene
loadScene(currentScene);
