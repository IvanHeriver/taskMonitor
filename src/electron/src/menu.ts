import { Menu, MenuItemConstructorOptions } from "electron";
import { openProjectFromFile } from "./files";

export function setupMainMenu(window, isDev, isMac = false, appName = "") {
  const menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: "Files",
      submenu: [
        {
          label: "Open",
          accelerator: "Ctrl+O",
          click: async () => {
            const response = await openProjectFromFile(window);
            window.webContents.send("load-project", response);
          },
        },
        { type: "separator" },
        {
          label: "Save",
          accelerator: "Ctrl+S",
          click: () => window.webContents.send("save-project"),
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: "Alt+F4",
          role: isMac ? "close" : "quit",
        },
      ],
    },
  ];
  if (isMac) {
    menuTemplate.unshift({
      label: appName,
      submenu: [{ role: "quit" }],
    });
  }
  if (isDev) {
    menuTemplate.push({
      label: "DEVELOPMENT",
      submenu: [
        {
          label: "Refresh",
          accelerator: "F5",
          role: "forceReload",
        },
        {
          label: "Toggle Developer Tools",
          accelerator: "F12",
          role: "toggleDevTools",
        },
      ],
    });
  }
  // set up the menu
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
