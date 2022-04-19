const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  shoudUseDarkMode: () => ipcRenderer.send("should-use-dark-mode"),
  onSetDarkMode: (callback) => ipcRenderer.on("set-dark-mode", callback),
  // toggleDarkMode: async () => await ipcRenderer.invoke("toggle-dark-mode"),
  onSaveProject: (callback) => {
    ipcRenderer.on("save-project", async () => {
      callback();
    });
  },
  saveProject: async (project) => {
    return await ipcRenderer.invoke("save-project", project);
  },
  loadProject: async () => {
    return await ipcRenderer.invoke("load-project");
  },
  onLoadProject: (callback) => {
    ipcRenderer.on("load-project", (_, loadedProjectInfo) => {
      console.log("*".repeat(210))
      console.log("loadedProjectInfo", loadedProjectInfo)
      callback(loadedProjectInfo);
    });
  },
  saveSession: async (projects, currentProjectId) => {
    return await ipcRenderer.invoke("save-session", projects, currentProjectId);
  },
  retrieveSession: async () => {
    return await ipcRenderer.invoke("retrieve-session");
  },
  onResize: (callback) => ipcRenderer.on("resize", callback),
  isNormal: async ()=>ipcRenderer.invoke("isNormal"),
  minimize: ()=>ipcRenderer.send("minimize"),
  maximize: ()=>ipcRenderer.send("maximize"),
  restore: ()=>ipcRenderer.send("restore"),
  close: ()=>ipcRenderer.send("close"),
  openMainMenue: () => ipcRenderer.send("menue"),
  checkAndUpdateApp: () => ipcRenderer.invoke("check-and-update"),
  onUpdateAvailable: (callback) => ipcRenderer.on("update-available", callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on("update-downloaded", callback),
});

const isDevelopment = "ISDEV" in process.env;

if (isDevelopment) {
  window.addEventListener("contextmenu", (e) => {
    ipcRenderer.send("right-click", e.x, e.y);
  });
}
