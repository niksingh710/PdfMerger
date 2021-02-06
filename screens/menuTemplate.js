const events = require("events");
const em = new events.EventEmitter();

exports.menu = [
  // {
  //   label: "Tools",
  //   submenu: [
  //     {
  //       role: "toggleDevTools",
  //     },
  //   ],
  // },
  {
    label: "Help",
    submenu: [
      {
        label: "Check for Updates",
        click: () => {
          em.emit("update");
        },
      },
      {
        label: "About",
        click: () => {
          em.emit("about");
        },
      },
    ],
  },
];

exports.em = em;
