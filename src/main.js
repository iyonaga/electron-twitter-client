import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';
import storage from 'electron-json-storage';
import Auth from './utils/auth';

let win;

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
      new Auth(res => {
        storage.set('accounts', res, () => {
          if (error) throw error;
          createWindow();
        });
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
