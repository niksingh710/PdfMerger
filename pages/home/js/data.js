const events = require("events");
const em = new events.EventEmitter();

const dropZone = document.getElementById("drop");
let data = [];
document.addEventListener("dragover", (e) => {
  e.preventDefault();
});
document.addEventListener("dragenter", (e) => {
  if (e.target.classList.contains("drop")) {
    dropZone.style.background = "rgba(0,0,0,.5)";
  }
});
document.addEventListener("dragleave", (e) => {
  if (e.target.classList.contains("drop")) {
    dropZone.style.background = "";
  }
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("drop")) {
    let id = data.length;
    for (const f of e.dataTransfer.files) {
      if (f.type !== "application/pdf") {
        em.emit("wrong-type", f.type);
      } else {
        let size = (f.size / (1024 * 1024)).toFixed(2);
        data.push({
          name: f.name,
          path: f.path,
          id,
          size,
        });
        em.emit("update", { name: f.name, path: f.path, id, size });
        id++;
      }
    }
    dropZone.style.background = "";
  }
});

exports.getData = () => {
  return data;
};
exports.em = em;

exports.setData = (updatedData) => {
  data = updatedData;
};
