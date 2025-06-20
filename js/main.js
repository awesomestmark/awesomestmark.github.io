// ... your existing main.js code above remains the same ...

function loadAd(adNum) {
  if (adNum < 1 || adNum > totalAds) return;
  const fileName = adNum < 10 ? `0${adNum}` : `${adNum}`;
  const path = `ads/${fileName}.xml`;
  const adContainer = document.getElementById("ad-container");
  console.log(`Loading ad file: ${path}`);

  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error(`Ad ${fileName}.xml not found (${response.status})`);
      return response.text();
    })
    .then(xmlString => {
      console.log(`Ad ${fileName} XML loaded`);
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, "text/xml");
      const contentElem = xml.getElementsByTagName("content")[0];
      if (!contentElem) throw new Error("No <content> tag found in ad XML");
      const content = contentElem.textContent || "";

      adContainer.innerHTML = content;

      applyAdTheme(adContainer);
      setupAdEventListeners(adContainer);

      currentAd = adNum;
    })
    .catch((err) => {
      adContainer.innerHTML = `
        <p style="color:red; font-weight:bold;">❌ Failed to load: ads/${fileName}.xml</p>
        <p style="font-size: 0.9rem;">${err.message}</p>
      `;
      console.error("Ad load error:", err);
    });
}

function applyAdTheme(adContainer) {
  const stylesheet = document.querySelector('link[rel=stylesheet]').href;
  const adBox = adContainer.querySelector('.ad-box');
  if (!adBox) return;

  adBox.classList.remove('theme-01', 'theme-02', 'theme-03', 'theme-04', 'dark-mode');

  if (stylesheet.includes('css/01.css')) {
    adBox.classList.add('theme-01');
    if (document.body.classList.contains('dark-mode')) {
      adBox.classList.add('dark-mode');
    }
  } else if (stylesheet.includes('css/02.css')) {
    adBox.classList.add('theme-02');
  } else if (stylesheet.includes('css/03.css')) {
    adBox.classList.add('theme-03');
  } else if (stylesheet.includes('css/04.css')) {
    adBox.classList.add('theme-04');
  }
}

function setupAdEventListeners(adContainer) {
  const freebitcoinAd = adContainer.querySelector('.freebitcoin-ad');
  if (freebitcoinAd) {
    freebitcoinAd.addEventListener('click', () => {
      console.log('FreeBitcoin ad clicked!');
    });
  }

  const referralButton = adContainer.querySelector('.referral-button');
  if (referralButton) {
    referralButton.addEventListener('click', () => {
      console.log('Referral link clicked!');
      // Add analytics code here if needed
    });
  }
}
