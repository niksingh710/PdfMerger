const { autoUpdater } = require("electron-updater");
const { dialog } = require("electron");
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "verbose";

autoUpdater.autoDownload = false;

exports.check = (manual = false) => {
  autoUpdater.checkForUpdates();

  if (manual) {
    autoUpdater.on("update-not-available", () => {
      dialog.showMessageBox({
        type: "info",
        title: "Update Not Here",
        message: "No New Update is Available",
        buttons: ["Ok"],
      });
    });
  }
  autoUpdater.on("update-available", (_updateInfo) => {
    dialog.showMessageBox({
      type: "info",
      title: "Update is Here",
      message: "New Update is Available",
      buttons: ["Ok"],
    });
  });
};
