/** Signals to privatenote.ai that the Chrome extension is installed (read by the web app). */
const DATASET_KEY = "privatenoteChromeExtension";

document.documentElement.dataset[DATASET_KEY] = "1";
window.dispatchEvent(new CustomEvent("privatenote-chrome-extension-ready"));
