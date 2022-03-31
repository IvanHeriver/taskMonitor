'use strict';

var electron = require('electron');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

// setup Inter Process Communication (IPC)
function setupIPC(window) {
    electron.ipcMain.handle("toggle-dark-mode", () => {
        if (electron.nativeTheme.shouldUseDarkColors) {
            electron.nativeTheme.themeSource = "light";
        }
        else {
            electron.nativeTheme.themeSource = "dark";
        }
        return electron.nativeTheme.shouldUseDarkColors;
    });
    // will be available only in dev mode
    const mouse_position = { x: Number, y: Number };
    const menu = new electron.Menu();
    const menuItem = new electron.MenuItem({
        label: "Inspect Element",
        click: () => {
            window.inspectElement(mouse_position.x, mouse_position.y);
        },
    });
    menu.append(menuItem);
    electron.ipcMain.on("right-click", (_, x, y) => {
        mouse_position.x = x;
        mouse_position.y = y;
        menu.popup({ window: window });
    });
}

function setupMainMenu(window, isDev, isMac = false, appName = "") {
    const menuTemplate = [
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
    const menu = electron.Menu.buildFromTemplate(menuTemplate);
    electron.Menu.setApplicationMenu(menu);
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const isDevelopment = "ISDEV" in process.env;
const isMac = process.platform === "darwin";
// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
function createMainWindow() {
    const window = new electron.BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path__default["default"].join(__dirname, "preload.js"),
        },
    });
    if (isDevelopment) {
        // this is for me only since I have a big monitor
        // and I split my screen in a specific way when developing
        window.setSize(1940, 1090);
        window.setPosition(1510, 0);
    }
    else {
        window.maximize();
    }
    if (isDevelopment) {
        window.loadURL(`http://localhost:${8080}`);
    }
    else {
        const urlToLoad = path__default["default"].join(__dirname, "..", "..", "front", "public", "index.html");
        window.loadURL(urlToLoad);
    }
    window.on("closed", () => {
        mainWindow = null;
    });
    window.on("ready-to-show", () => {
        window.show();
        if (isDevelopment)
            window.webContents.openDevTools();
    });
    return window;
}
// quit application when all windows are closed
electron.app.on("window-all-closed", () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (!isMac) {
        electron.app.quit();
    }
});
electron.app.on("activate", () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});
// create main BrowserWindow when electron is ready
electron.app.on("ready", () => {
    electron.app.allowRendererProcessReuse = true;
    mainWindow = createMainWindow();
    setupMainMenu(mainWindow, isDevelopment, isMac, electron.app.name);
    setupIPC(mainWindow);
});
//# sourceMappingURL=index.js.map
