const { app, BrowserWindow } = require("electron");

var win = null;

//
// Create browser window.
//
function createWindow() {
  win = new BrowserWindow({
    width: 1500,
    height: 850,
    //frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL("http://localhost:4200");
  //win.loadFile('index.html') // make this the dist dir of angular app
  //win.webContents.openDevTools();

  setTimeout(() => {
    win.webContents.send("on-data", { woots: "foobar123" });
  }, 1500);
}

app.whenReady().then(createWindow);

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

setTimeout(() => {
  win.webContents.send("on-data", { woots: "foobar" });
}, 2000);
