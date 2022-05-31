import { ipcMain, Menu, MenuItem, nativeTheme, dialog } from "electron";
import { retrieveSession, saveProjectToFile, saveSession, openProjectFromFile } from "./files";
import {setupMainMenu} from "./menu"

// setup Inter Process Communication (IPC)
export function setupIPC(window: Electron.BrowserWindow, menu: Electron.Menu, app: Electron.App, autoUpdater, isDev, isMac) {
  // ipcMain.handle("toggle-dark-mode", () => {
  //   if (nativeTheme.shouldUseDarkColors) {
  //     nativeTheme.themeSource = "light";
  //   } else {
  //     nativeTheme.themeSource = "dark";
  //   }
  //   return nativeTheme.shouldUseDarkColors;
  // });

  ipcMain.handle("setup-i18n", (_, config) => {
    console.log(" config.locale",  config.locale)
    menu = setupMainMenu(window, isDev, isMac, app.name, (key)=>{
      const keys = key.split(".")
      let dictionnary = {...config.translations[config.locale]}
      for (let k of keys) {
        if (k in dictionnary) {
          dictionnary = dictionnary[k]
        } else {
          break
        }
      }
      if (typeof dictionnary === "string") {
        return dictionnary
      } else {
        return "undefined"
      }
    }, config.locale, config.languages)
  //   const menu_template ={
  //   label: "Language",
  //   visible: isDev,
  //   submenu: [
  //     {
  //       label: "Refresh",
  //       accelerator: "F5",
  //       role: "forceReload",
  //     },
  //     {
  //       label: "Toggle Developer Tools",
  //       accelerator: "Ctrl+Shift+I",
  //       role: "toggleDevTools",
  //     },
  //     {
  //       label: "Toggle Developer Tools (invisible)",
  //       accelerator: "F12",
  //       visible: false,
  //       role: "toggleDevTools",
  //     },
  //   ],
  // }
  return "done"
  })

  ipcMain.on("should-use-dark-mode", () => {
    window.webContents.send("set-dark-mode", nativeTheme.shouldUseDarkColors);
  })

  ipcMain.handle("save-project", (_, project) => {
    return saveProjectToFile(window, project);
  });

  ipcMain.handle("load-project", async () => {
    const response = await openProjectFromFile(window);
    window.webContents.send("load-project", response);
  });

  // let debouncer = null;
  ipcMain.handle(
    "save-session",
    async (_, projects, currentProjectId): Promise<boolean> => {
      saveSession(projects, currentProjectId, app.getPath("userData"));
      return true;
    }
  );

  ipcMain.handle("retrieve-session", () => {
    return retrieveSession(app.getPath("userData"));
  });


  ipcMain.on("minimize", ()=>window.minimize())
  ipcMain.on("maximize", ()=>window.maximize())
  ipcMain.on("restore", ()=>window.restore())
  ipcMain.on("close", ()=>window.close())
  ipcMain.handle("isNormal", ()=>window.isNormal())
  window.on("resize", ()=>{
    window.webContents.send("resize", window.isNormal())
  })
  ipcMain.on("menue", ()=>{
    menu.popup({window: window, x:0, y:28})
  })


  ipcMain.handle('check-and-update', ()=>{
    // const currentVersion = app.getVersion()
    const currentVersion = app.getVersion()
    autoUpdater.checkForUpdatesAndNotify()
    return currentVersion
  })

  ipcMain.handle("ask-question", async (_, config) => {
    const res = await dialog.showMessageBox(window, {
      title: "Tatimo",
      message: config.message,
      type: "question",
      buttons: config.buttons,
      cancelId: config.cancelID
    })
    return res
  })

  // will be available only in dev mode
  const mouse_position: { x: number, y: number  }= {x: null, y: null};
  const devMenue = new Menu();
  const menueItem = new MenuItem({
    label: "Inspect Element",
    click: () => {
      window.webContents.inspectElement(mouse_position.x, mouse_position.y);
      // window.inspect
    },
  });
  devMenue.append(menueItem);
  ipcMain.on("right-click", (_, x, y) => {
    mouse_position.x = x;
    mouse_position.y = y;
    devMenue.popup({ window: window });
  });

}
