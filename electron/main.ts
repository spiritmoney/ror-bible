import { app, BrowserWindow, screen as electronScreen } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';

const createMainWindow = () => {
  let mainWindow = new BrowserWindow({
    width: electronScreen.getPrimaryDisplay().workArea.width,
    height: electronScreen.getPrimaryDisplay().workArea.height,
    icon: path.join(__dirname, '../public/icon/icon_512x512.png'),
    show: false,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: false,
      devTools: isDev,
    },
  });

  const startURL = isDev
    ? 'http://localhost:3400'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('closed', () => {
    mainWindow = null as unknown as BrowserWindow;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    mainWindow.loadURL(url);
    return { action: 'deny' };
  });
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
