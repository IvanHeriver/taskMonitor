import { Menu, MenuItemConstructorOptions, nativeTheme } from "electron";
import { openProjectFromFile } from "./files";

export function setupMainMenu(window, isDev, isMac = false, appName = "") {
  // const menuTemplate: MenuItemConstructorOptions[] = [
  //   {
  //     label: "Files",
  //     submenu: [
  //       {
  //         label: "Open",
  //         accelerator: "Ctrl+O",
  //         click: async () => {
  //           const response = await openProjectFromFile(window);
  //           window.webContents.send("load-project", response);
  //         },
  //       },
  //       { type: "separator" },
  //       {
  //         label: "Save",
  //         accelerator: "Ctrl+S",
  //         click: () => window.webContents.send("save-project"),
  //       },
  //       { type: "separator" },
  //       {
  //         label: "Exit",
  //         accelerator: "Alt+F4",
  //         role: isMac ? "close" : "quit",
  //       },
  //     ],
  //   },
  // ];
  // if (isMac) {
  //   menuTemplate.unshift({
  //     label: appName,
  //     submenu: [{ role: "quit" }],
  //   });
  // }
  // if (isDev) {
  //   menuTemplate.push({
  //     label: "DEVELOPMENT",
  //     submenu: [
  //       {
  //         label: "Refresh",
  //         accelerator: "F5",
  //         role: "forceReload",
  //       },
  //       {
  //         label: "Toggle Developer Tools",
  //         accelerator: "F12",
  //         role: "toggleDevTools",
  //       },
  //     ],
  //   });
  // }
  const menuTemplate: MenuItemConstructorOptions[] = [

        {
          label: "Toggle Dark Mode",
          click: () => {
                if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = "light";
    } else {
      nativeTheme.themeSource = "dark";
    }
            window.webContents.send("set-dark-mode", nativeTheme.shouldUseDarkColors);
          },
        },
        { type: "separator" },
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
      ]
  // if (isDev) {
    menuTemplate.unshift({
      label: "DEVELOPMENT",
      visible: isDev,   
      submenu: [
        {
          label: "Refresh",
          accelerator: "F5",
          role: "forceReload",
        },
        {
          label: "Toggle Developer Tools",
          accelerator:"Ctrl+Shift+I",
          role: "toggleDevTools",
        },
        {
        label: "Toggle Developer Tools (invisible)",
        accelerator: "F12",
        visible: false,   
         role: "toggleDevTools",
      },
      ],
    });
  // }
  // set up the menu
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  return menu
}
