import { ipcMain, Menu, MenuItem, nativeTheme } from "electron";

// setup Inter Process Communication (IPC)
export function setupIPC(window) {
  ipcMain.handle("toggle-dark-mode", () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = "light";
    } else {
      nativeTheme.themeSource = "dark";
    }
    return nativeTheme.shouldUseDarkColors;
  });

  // will be available only in dev mode
  const mouse_position = { x: Number, y: Number };
  const menu = new Menu();
  const menuItem = new MenuItem({
    label: "Inspect Element",
    click: () => {
      window.inspectElement(mouse_position.x, mouse_position.y);
    },
  });
  menu.append(menuItem);
  ipcMain.on("right-click", (_, x, y) => {
    mouse_position.x = x;
    mouse_position.y = y;
    menu.popup({ window: window });
  });
}
