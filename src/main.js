import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import storage from 'electron-json-storage';
import Auth from './utils/auth';

let win;

function authenticate() {
  return new Promise((resolve, reject) => {
    const auth = new Auth();
    auth.then(res => {
      storage.set('accounts', res, error => {
        if (error) reject(error);
        resolve();
      });
    });
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    })
  );

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  storage.get('accounts', (error, data) => {
    if (error) throw error;

    if (Object.keys(data).length === 0) {
      authenticate().then(() => {
        createWindow();
      });
    } else {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('removeAccount', () => {
  storage.remove('accounts', error => {
    if (error) throw error;
    win.close();

    authenticate().then(() => {
      createWindow();
    });
  });
});
