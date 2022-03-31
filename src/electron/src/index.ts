import {
  app,
  Menu,
  MenuItem,
  BrowserWindow,
  ipcMain,
  dialog,
  nativeTheme,
  MenuItemConstructorOptions,
} from "electron";
import path from "path";
import { setupIPC } from "./ipc";
import { setupMainMenu } from "./menu";

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const isDevelopment = "ISDEV" in process.env;
const isMac = process.platform === "darwin";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDevelopment) {
    // this is for me only since I have a big monitor
    // and I split my screen in a specific way when developing
    window.setSize(1940, 1090);
    window.setPosition(1510, 0);
  } else {
    window.maximize();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${8080}`);
  } else {
    const urlToLoad = path.join(
      __dirname,
      "..",
      "..",
      "front",
      "public",
      "index.html"
    );
    window.loadURL(urlToLoad);
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.on("ready-to-show", () => {
    window.show();
    if (isDevelopment) window.webContents.openDevTools();
  });

  return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  app.allowRendererProcessReuse = true;
  mainWindow = createMainWindow();
  setupMainMenu(mainWindow, isDevelopment, isMac, app.name);
  setupIPC(mainWindow);
});

