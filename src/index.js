const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;
let loadingWindow;

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // Remove window frame for a custom loading screen
    show: false, // Hide the window initially
  });

  loadingWindow.loadFile('src/loading-screen.html');

  // Once the loading screen is ready to show, display it
  loadingWindow.once('ready-to-show', () => {
    loadingWindow.show();
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, 'src','blueNetEase-Music-logo.icns'),
    
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('src/index.html');

  // Open the DevTools if needed
  // mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => {
    // Once the main window is ready to show, close the loading window
    if (loadingWindow) {
      loadingWindow.close();
    }
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createLoadingWindow();
  createMainWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createLoadingWindow();
      createMainWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
