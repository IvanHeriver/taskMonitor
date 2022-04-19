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
import { autoUpdater } from "electron-updater";
// import { saveSession } from "./files";

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const isDevelopment = "ISDEV" in process.env;
const isMac = process.platform === "darwin";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
let mainMenu

function createMainWindow() {
  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "..", "preload.js"),
    },
    minWidth: 1080,
    minHeight: 660,
    frame: false,
    title: "Tatimo",
    icon: path.join(__dirname, "..", "ihdev_icon_src_icon.ico"),
  });

  // window.on("close", function (e) {
  //   saveSession()
  //   // const choice = dialog.showMessageBoxSync(this, {
  //   //   type: "question",
  //   //   buttons: ["Yes", "No"],
  //   //   title: "Confirm",
  //   //   message:
  //   //     "Some files are not saved and any modification will be lost. Are you sure you wan't to quite?",
  //   // });
  //   // if (choice === 1) {
  //   //   e.preventDefault();
  //   // }
  // });

  if (isDevelopment) {
    // this is for me only since I have a big monitor
    // and I split my screen in a specific way when developing
    window.setSize(1940, 1090);
    window.setPosition(1510, 0);
    // window.maximize();
    
  } else {
    // window.maximize();
    window.setSize(1080, 660);
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

  window.on("ready-to-show", async () => {
    await window.show();
    // window.webContents.send("set-dark-mode", nativeTheme.shouldUseDarkColors);
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
  // app.allowRendererProcessReuse = true;
  mainWindow = createMainWindow();
  mainMenu = setupMainMenu(mainWindow, isDevelopment, isMac, app.name);
  console.log("App user date path:", app.getPath("userData"))
  setupIPC(mainWindow, mainMenu, app, autoUpdater);
});

autoUpdater.on("update-available", ()=>{
  mainWindow.webContents.send("update-available")
})
autoUpdater.on("update-downloaded", ()=>{
  mainWindow.webContents.send("update-downloaded")
})