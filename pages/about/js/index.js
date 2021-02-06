const { shell, ipcRenderer } = require("electron");

const version = document.getElementById("version");
const tg = document.getElementById("telegram");
const gh = document.getElementById("github");
const pp = document.getElementById("paypal");
let appVersion = ipcRenderer.sendSync("get-version");

version.innerHTML = `${appVersion}`;
tg.addEventListener("click", () => {
  shell.openExternal("https://t.me/niksingh710");
});
gh.addEventListener("click", () => {
  shell.openExternal("https://github.com/niksingh710");
});
pp.addEventListener("click", () => {
  shell.openExternal("https://paypal.me/niksingh710");
});
