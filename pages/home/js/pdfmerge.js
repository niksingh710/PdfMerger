const { ipcRenderer } = require("electron");
const PDFMerger = require("pdf-merger-js");

const submit = async (data) => {
  let merger = new PDFMerger();
  let { canceled, filePath } = ipcRenderer.sendSync("save");
  if (!canceled) {
    data.forEach((item) => {
      merger.add(item.path);
    });
    await merger.save(`${filePath}.pdf`);
  }
};
exports.submit = submit;
