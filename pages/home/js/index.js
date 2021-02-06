const { ipcRenderer } = require("electron");
const { em, getData, setData } = require("./data");
const { submit } = require("./pdfmerge");

const ul = document.getElementById("list-container");
const submitBtn = document.getElementById("submit");
const clearBtn = document.getElementById("clear");

em.on("update", ({ name, id, size }) => {
  let li = document.createElement("li");
  li.innerHTML = `
    <div class="draggable" draggable="true" data-index="${id}" data-id="${id}">
    <span class="name">
    ${name}</span>
                      <div><span class="size">${size}MB</span>
                      <span class="drag-pick"><i class="fas fa-bars"></i></span><div>
                      <button class="remove" onclick="removeData(${id})" data-id="${id}"><i class="fas fa-times"></i></button>
                  </div>
    `;
  ul.appendChild(li);
});

em.on("removeid", (id) => {
  let data = getData();

  data = data.filter((item) => item.id !== id);
  setData(data);
  updateUi();
});

em.on("wrong-type", (type) => {
  ipcRenderer.send("wrong-type", type);
});

const updateUi = () => {
  let data = getData();
  ul.innerHTML = ``;
  data.forEach((item, index) => {
    item.id = index;
    em.emit("update", item);
  });
};
setInterval(() => {
  if (getData().length == 0) {
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = "#aaa";
    submitBtn.style.color = "#eee";

    clearBtn.disabled = true;
    clearBtn.style.backgroundColor = "#aaa";
    clearBtn.style.color = "#eee";
    clearBtn.children[0].classList.remove("active");
  } else {
    submitBtn.disabled = false;
    submitBtn.style.backgroundColor = "";
    submitBtn.style.color = "";

    clearBtn.disabled = false;
    clearBtn.style.backgroundColor = "";
    clearBtn.style.color = "";
    clearBtn.children[0].classList.add("active");
  }

  const draggables = document.querySelectorAll(".draggable");
  const remove = document.querySelectorAll(".remove");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
      remove.forEach((item) => {
        item.style.opacity = "0";
        item.style.visibility = "hidden";
      });
    });
    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
      remove.forEach((item) => {
        item.style.opacity = "";
        item.style.visibility = "";
      });
    });
  });
}, 100);
submitBtn.addEventListener("click", async () => {
  updateData();
  await submit(getData());
});

clearBtn.addEventListener("click", () => {
  ul.innerHTML = ``;
  updateData();
});

ul.addEventListener("dragover", (e) => {
  e.preventDefault();

  let afterEl = getDragAfterElement(ul, e.clientY);
  afterEl = afterEl ? afterEl.parentNode : null;
  let draggableList = document.querySelector(".dragging");
  draggableList = draggableList ? draggableList.parentNode : null;
  if (afterEl == null) {
    if (draggableList) ul.appendChild(draggableList);
  } else {
    if (draggableList) ul.insertBefore(draggableList, afterEl);
  }
});

function getDragAfterElement(container, y) {
  const draggableEl = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableEl.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

const updateData = () => {
  let newDataList = [];
  let oldDataList = getData();
  let preIndex = [];
  ul.querySelectorAll("li").forEach((item) => {
    preIndex.push(item.children[0].getAttribute("data-index"));
  });
  preIndex.forEach((item, index) => {
    newDataList[index] = oldDataList[item];
  });
  setData(newDataList);
  updateUi();
};
