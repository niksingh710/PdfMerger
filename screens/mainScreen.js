const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const windowStateKeeper = require("electron-window-state");
const { check } = require("./updater");
const { menu, em } = require("./menuTemplate");
let win;
exports.createWindow = () => {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 750,
  });

  win = new BrowserWindow({
    minWidth: 450,
    minHeight: 750,
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));

  win.loadFile(`${__dirname}/../pages/home/index.html`);

  win.once("ready-to-show", win.show);
  mainWindowState.manage(win);
};

ipcMain.on("save", (e) => {
  dialog
    .showSaveDialog({
      title: "Save",
      defaultPath: app.getPath("documents"),
      properties: ["showOverwriteConfirmation"],
    })
    .then((udata) => {
      e.returnValue = udata;
    });
});
ipcMain.on("get-version", (e) => {
  e.returnValue = app.getVersion();
});
em.on("about", () => {
  check(true);
});

em.on("about", () => {
  const child = new BrowserWindow({
    parent: win,
    modal: true,
    show: false,
    width: 350,
    height: 200,
    resizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  child.loadFile(`${__dirname}/../pages/about/index.html`);
  child.once("ready-to-show", () => {
    child.show();
  });
});

console.log(process.env.APP_ENV);
exports.app = app;
exports.dialog = dialog;
exports.ipcMain = ipcMain;
if (process.env.APP_ENV === "development") {
  try {
    require("electron-reloader")(module);
  } catch (_) {}
}
