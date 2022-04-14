import { ipcMain, Menu, MenuItem, nativeTheme } from "electron";
import { retrieveSession, saveProjectToFile, saveSession, openProjectFromFile } from "./files";
// setup Inter Process Communication (IPC)
export function setupIPC(window, menue) {
  // ipcMain.handle("toggle-dark-mode", () => {
  //   if (nativeTheme.shouldUseDarkColors) {
  //     nativeTheme.themeSource = "light";
  //   } else {
  //     nativeTheme.themeSource = "dark";
  //   }
  //   return nativeTheme.shouldUseDarkColors;
  // });

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
      saveSession(projects, currentProjectId);
      return true;
    }
  );

  ipcMain.handle("retrieve-session", () => {
    return retrieveSession();
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
    menue.popup({window: window, x:0, y:28})
  })


  // will be available only in dev mode
  const mouse_position = { x: Number, y: Number };
  const devMenue = new Menu();
  const menueItem = new MenuItem({
    label: "Inspect Element",
    click: () => {
      window.inspectElement(mouse_position.x, mouse_position.y);
    },
  });
  devMenue.append(menueItem);
  ipcMain.on("right-click", (_, x, y) => {
    mouse_position.x = x;
    mouse_position.y = y;
    devMenue.popup({ window: window });
  });
}
