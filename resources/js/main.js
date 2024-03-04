function generatePhoneNumbers(count) {
  const c = Array.from(new Array(count), () => {
    return (
      `1` +
      [3, 5, 7, 8][Math.round(Math.random() * 1e7) % 4] +
      Math.round(1e8 * Math.random())
        .toString()
        .slice(0)
        .padStart(9, 0)
    );
  }).join("\n");
  return c;
}

function initApp() {
  document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const count = +e.target.count.value;
    const c = generatePhoneNumbers(count);
    const result = document.querySelector("#result");
    result.rows = count;
    result.value = c;
  });

  document.querySelector("#copy").addEventListener('click', () => {
    Neutralino.clipboard.writeText(document.querySelector("#result").value).then(() => {
        Neutralino.os.showNotification(':)', '复制成功');
    }, (e) => {
        console.error(e);
        Neutralino.os.showNotification(':/', '复制失败', 'ERROR');
    });
  });
}

function setTray() {
  if (NL_MODE != "window") {
    console.log("INFO: Tray menu is only available in the window mode.");
    return;
  }
  let tray = {
    icon: "/resources/icons/trayIcon.png",
    menuItems: [
      { id: "VERSION", text: "版本" },
      { id: "SEP", text: "-" },
      { id: "QUIT", text: "退出" },
    ],
  };
  Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
  switch (event.detail.id) {
    case "VERSION":
      Neutralino.os.showMessageBox(
        "版本信息",
        `Neutralinojs服务器: v${NL_VERSION} | Neutralinojs客户端: v${NL_CVERSION}`
      );
      break;
    case "QUIT":
      Neutralino.app.exit();
      break;
  }
}

function onWindowClose() {
  Neutralino.app.exit();
}

Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

if (NL_OS != "Darwin") {
  // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
  setTray();
}

initApp();
