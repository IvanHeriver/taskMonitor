import { Menu, MenuItemConstructorOptions } from "electron";

export function setupMainMenu(window, isDev, isMac=false, appName="") {
  const menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: "Files",
      submenu: [
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
      submenu: [
        { role: "quit" },
      ],
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
