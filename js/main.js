let currentScene = 1;

function loadScene(sceneNum) {
  const fileName = sceneNum < 10 ? `0${sceneNum}` : `${sceneNum}`;
  fetch(`xml/${fileName}.xml`)
    .then(response => {
      if (!response.ok) throw new Error("Scene not found");
      return response.text();
    })
    .then(xmlString => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, "text/xml");
      const content = xml.getElementsByTagName("content")[0]?.textContent || "";
      document.getElementById("scene-container").innerHTML = content || "<p class='presence'>You are here.</p>";
      currentScene = sceneNum;
    })
    .catch(() => {
      document.getElementById("scene-container").innerHTML = "<p class='presence'>You are here.</p>";
    });
}

document.getElementById("prev-scene").addEventListener("click", () => {
  if (currentScene > 1) loadScene(currentScene - 1);
});

document.getElementById("next-scene").addEventListener("click", () => {
  loadScene(currentScene + 1);
});

// Initial scene load
loadScene(currentScene);
