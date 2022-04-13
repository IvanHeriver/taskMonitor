const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  toggleDarkMode: () => ipcRenderer.invoke("toggle-dark-mode"),
  onSaveProject: (callback) => {
    ipcRenderer.on("save-project", async () => {
      callback();
    });
  },
  saveProject: async (project) => {
    return await ipcRenderer.invoke("save-project", project);
  },
  onLoadProject: (callback) => {
    ipcRenderer.on("load-project", (_, loadedProject) => {
      callback(loadedProject);
    });
  },
  saveSession: async (projects, currentProjectId) => {
    return await ipcRenderer.invoke("save-session", projects, currentProjectId);
  },
  retrieveSession: async () => {
    return await ipcRenderer.invoke("retrieve-session");
  },
});

const isDevelopment = "ISDEV" in process.env;

if (isDevelopment) {
  window.addEventListener("contextmenu", (e) => {
    ipcRenderer.send("right-click", e.x, e.y);
  });
}
