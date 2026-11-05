import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  net,
  protocol,
  screen as electronScreen,
  session,
  shell,
} from 'electron';
import path from 'path';
import { pathToFileURL } from 'url';
import fs from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';

const isDev = !app.isPackaged;

const PROTOCOL = 'rhapsody-bible';
const APP_SCHEME = 'app';
const LOOPBACK_AUTH_PORT = 47823;
const HOSTING_ORIGIN = 'https://rhapsodybible.web.app';
const logExternalOpens = process.argv.includes('--log-external-opens');
const externalOpenLog: string[] = [];

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

let mainWindow: BrowserWindow | null = null;

const getPreloadPath = () => path.join(__dirname, 'preload.js');

const getBuildRoot = () => path.join(__dirname, '..', 'build');

const getIndexHtmlPath = () => path.join(getBuildRoot(), 'index.html');

const getDevUrl = () => 'http://localhost:3400';

const getAppLoadUrl = () =>
  isDev ? getDevUrl() : `${APP_SCHEME}://rhapsody/index.html`;

/** HashRouter entry for packaged app (avoids website home flash before React redirect). */
const getInitialLoadUrl = () => {
  const base = getAppLoadUrl().split('#')[0];
  if (isDev) {
    return base;
  }
  return `${base}#/bible-online`;
};

const resolveBuildFilePath = (pathname: string) => {
  let relPath = decodeURIComponent(pathname);
  if (relPath === '/' || relPath === '') {
    relPath = '/index.html';
  }
  const normalized = path.normalize(
    path.join(getBuildRoot(), relPath.replace(/^\//, ''))
  );
  const buildRoot = path.normalize(getBuildRoot());
  if (!normalized.startsWith(buildRoot)) {
    return null;
  }
  return normalized;
};

const registerAppProtocol = () => {
  protocol.handle(APP_SCHEME, request => {
    const filePath = resolveBuildFilePath(new URL(request.url).pathname);
    if (!filePath) {
      return new Response('Forbidden', { status: 403 });
    }
    return net.fetch(pathToFileURL(filePath).href);
  });
};

const isAllowedInAppNavigation = (targetUrl: string): boolean => {
  try {
    const parsed = new URL(targetUrl);
    if (isDev) {
      return (
        parsed.origin === 'http://localhost:3400' ||
        parsed.origin === 'http://127.0.0.1:3400'
      );
    }
    return parsed.protocol === `${APP_SCHEME}:`;
  } catch {
    return false;
  }
};

const isHttpUrl = (url: string) => /^https?:\/\//i.test(url);

const navigateRendererToAuthCallback = (rawUrl: string) => {
  if (!mainWindow) return;
  try {
    const incoming = new URL(rawUrl);
    if (incoming.protocol !== `${PROTOCOL}:`) return;

    const query = incoming.search ? incoming.search : '';
    const hashPath = `/auth/callback${query}`;
    const base = getAppLoadUrl().split('#')[0];
    mainWindow.loadURL(`${base}#${hashPath}`);
  } catch {
    // ignore malformed callback URLs
  }
};

const wireNavigationHandlers = (win: BrowserWindow) => {
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isHttpUrl(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (!isAllowedInAppNavigation(url)) {
      event.preventDefault();
      if (isHttpUrl(url)) {
        shell.openExternal(url);
      }
    }
  });
};

const applyContentSecurityPolicy = () => {
  const csp = [
    "default-src 'self' app:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: http:",
    "media-src 'self' blob: https: http:",
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net https://firestore.googleapis.com https://firebasestorage.googleapis.com https://connect.kingsch.at https://accounts.kingschat.online https://api.rorbible.plus https://cdn.rorbible.plus https://rorbible.plus https://rhapsodybible.web.app https://*.workers.dev https://restcountries.com wss://*.firebaseio.com http://localhost:3000 http://127.0.0.1:*",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ');

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp],
      },
    });
  });
};

const installApplicationMenu = () => {
  const template: Electron.MenuItemConstructorOptions[] = [
    ...(process.platform === 'darwin'
      ? [{ role: 'appMenu' as const }]
      : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    { role: 'windowMenu' },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

const getWindowIconPath = (): string => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'app-icon.png');
  }
  return path.join(__dirname, '..', 'build-resources', 'icon.png');
};

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: electronScreen.getPrimaryDisplay().workArea.width,
    height: electronScreen.getPrimaryDisplay().workArea.height,
    minWidth: 1024,
    minHeight: 720,
    icon: getWindowIconPath(),
    show: false,
    backgroundColor: 'white',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      devTools: isDev,
      preload: getPreloadPath(),
    },
  });

  wireNavigationHandlers(mainWindow);
  mainWindow.loadURL(getInitialLoadUrl());

  mainWindow.once('ready-to-show', () => mainWindow?.show());

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, argv) => {
    const protocolArg = argv.find(arg => arg.startsWith(`${PROTOCOL}://`));
    if (protocolArg) {
      navigateRendererToAuthCallback(protocolArg);
    }
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

ipcMain.handle('shell:open-external', async (_event, url: string) => {
  if (typeof url !== 'string' || !isHttpUrl(url)) {
    return;
  }
  if (logExternalOpens) {
    externalOpenLog.push(url);
  }
  await shell.openExternal(url);
});

ipcMain.handle('shell:clear-external-open-log', () => {
  externalOpenLog.length = 0;
});

ipcMain.handle('shell:get-external-open-log', () => [...externalOpenLog]);

ipcMain.handle('strongs:load-json', async (_event, relativePath: string) => {
  if (typeof relativePath !== 'string') {
    throw new Error('Invalid Strong\'s asset path');
  }
  const safeRelative = relativePath.replace(/\\/g, '/').replace(/\.\./g, '');
  const localFile = path.join(
    app.getPath('userData'),
    'HebrewGreekRes',
    ...safeRelative.split('/')
  );
  const cacheRoot = path.normalize(
    path.join(app.getPath('userData'), 'HebrewGreekRes')
  );
  const normalizedLocal = path.normalize(localFile);
  if (!normalizedLocal.startsWith(cacheRoot)) {
    throw new Error('Strong\'s path escapes cache directory');
  }

  if (fs.existsSync(normalizedLocal)) {
    return readFile(normalizedLocal, 'utf8');
  }

  const remoteUrl = `${HOSTING_ORIGIN}/HebrewGreekRes/${safeRelative}`;
  const response = await fetch(remoteUrl);
  if (!response.ok) {
    throw new Error(`Strong's download failed (${response.status})`);
  }
  const text = await response.text();
  await mkdir(path.dirname(normalizedLocal), { recursive: true });
  await writeFile(normalizedLocal, text, 'utf8');
  return text;
});

app.setAsDefaultProtocolClient(PROTOCOL);

if (process.platform === 'darwin') {
  app.on('open-url', (event, url) => {
    event.preventDefault();
    navigateRendererToAuthCallback(url);
  });
}

app.whenReady().then(async () => {
  if (process.env.ELECTRON_UPDATE_URL) {
    const { autoUpdater } = await import('electron-updater');
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.setFeedURL({
      provider: 'generic',
      url: process.env.ELECTRON_UPDATE_URL,
    });
  }

  if (!isDev) {
    registerAppProtocol();
  }
  installApplicationMenu();
  applyContentSecurityPolicy();
  createMainWindow();

  if (process.platform === 'win32' && process.argv.length > 1) {
    const protocolArg = process.argv.find(arg => arg.startsWith(`${PROTOCOL}://`));
    if (protocolArg) {
      navigateRendererToAuthCallback(protocolArg);
    }
  }

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

export { LOOPBACK_AUTH_PORT, PROTOCOL };
