import { ipcMain, Menu, MenuItem, nativeTheme, dialog } from "electron";
import { retrieveSession, saveProjectToFile, saveSession, openProjectFromFile } from "./files";


// setup Inter Process Communication (IPC)
export function setupIPC(window: Electron.BrowserWindow, menu: Electron.Menu, app: Electron.App, autoUpdater) {
  // ipcMain.handle("toggle-dark-mode", () => {
  //   if (nativeTheme.shouldUseDarkColors) {
  //     nativeTheme.themeSource = "light";
  //   } else {
  //     nativeTheme.themeSource = "dark";
  //   }
  //   return nativeTheme.shouldUseDarkColors;
  // });
  ipcMain.on("should-use-dark-mode", () => {
    window.webContents.send("set-dark-mode", nativeTheme.shouldUseDarkColors);
  })

  ipcMain.handle("save-project", (_, project) => {
    return saveProjectToFile(window, project);
  });

  ipcMain.handle("load-project", async () => {
    const response = await openProjectFromFile(window);
    console.log(response.project.todos)
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
    console.log("App current version: ", currentVersion)
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
