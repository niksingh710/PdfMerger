require("dotenv").config();

const { app, createWindow, ipcMain, dialog } = require("./screens/mainScreen");

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("wrong-type", (_item, _args) => {
  dialog.showMessageBox({
    type: "info",
    title: "Invalid File",
    message: `Only Pdf Format is supported`,
    buttons: ["ok"],
  });
});
