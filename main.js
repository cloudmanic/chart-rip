const { app, BrowserWindow } = require("electron");
const http = require("http");
const url = require("url");
const path = require("path");

const host = "127.0.0.1";
const port = 9090;
var win = null;

// Setup webserver
const server = http.createServer(function (req, res) {
  // Parse request.
  const queryObject = url.parse(req.url, true).query;
  const title = queryObject.title.trim();
  const labels = queryObject.labels.trim().split(",");
  let data = queryObject.data.trim().split(",");

  // Json Response.
  res.setHeader("Content-Type", "application/json");

  // Do some validation.
  if (title.length == 0 || data.length == 0 || labels.length == 0) {
    res.writeHead(400);
    res.end(`{"error": "Request not properly formed."}`);
    return;
  }

  // Send data to frontend
  win.webContents.send("on-data", { title: title, labels: labels, data: data });

  // Return happy.
  res.writeHead(204);
  res.end();
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

//
// Create browser window.
//
function createWindow() {
  win = new BrowserWindow({
    width: 1500,
    height: 850,
    //frame: false,
    //titleBarStyle: "hidden",
    webPreferences: {
      //webSecurity: false,
      nodeIntegration: true,
    },
  });

  // win.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, `./dist/chart-rip/index.html`),
  //     protocol: "file:",
  //     slashes: true,
  //   })
  // );

  win.loadURL("http://localhost:4200");
  //win.webContents.openDevTools();
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
