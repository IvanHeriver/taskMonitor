const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  toggleDarkMode: () => ipcRenderer.invoke("toggle-dark-mode"),
});

const isDevelopment = "ISDEV" in process.env;

if (isDevelopment) {
  window.addEventListener("contextmenu", (e) => {
    ipcRenderer.send("right-click", e.x, e.y);
  });
}