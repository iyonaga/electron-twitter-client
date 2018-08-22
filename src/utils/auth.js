import { BrowserWindow } from 'electron';
import TwitterAPI from 'node-twitter-api';

let win = null;

export default class Auth {
  static createWindow(url) {
    win = new BrowserWindow({
      width: 800,
      height: 600
    });

    win.loadURL(`${url}&force_login=true`);

    win.on('closed', () => {
      win = null;
    });
  }

  constructor() {
    this.consumerKey = 'Xy2gvXDx6eU6qsJQp9s3gY1Nx';
    this.consumerSecret = 'vGFt5jpaQ2G9Z26UaWk1zzE5PMAiyTjdYLk9G1fBqBfg0dhmdr';

    this.twitter = new TwitterAPI({
      consumerKey: this.consumerKey,
      consumerSecret: this.consumerSecret,
      callback: 'http://example.com'
    });

    return new Promise((resolve, reject) => {
      this.twitter.getRequestToken((err, requestToken, requestTokenSecret) => {
        if (err) {
          reject(err);
        }

        const url = this.twitter.getAuthUrl(requestToken);

        Auth.createWindow(url);

        this.getAccessToken(requestToken, requestTokenSecret)
          .then(tokens =>
            this.verifyCredentials(tokens.accessToken, tokens.accessTokenSecret)
          )
          .then(res => {
            resolve(res);
            if (win) {
              setTimeout(() => win.close(), 100);
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    });
  }

  getAccessToken(requestToken, requestTokenSecret) {
    return new Promise((resolve, reject) => {
      win.webContents.on('will-navigate', (event, url) => {
        event.preventDefault();

        const matched = url.match(
          /\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/
        );

        if (matched) {
          this.twitter.getAccessToken(
            requestToken,
            requestTokenSecret,
            matched[2],
            (error, accessToken, accessTokenSecret) => {
              if (error) {
                reject(error);
              } else {
                resolve({ accessToken, accessTokenSecret });
              }
            }
          );
        }
      });
    });
  }

  verifyCredentials(accessToken, accessTokenSecret, params = {}) {
    return new Promise((resolve, reject) => {
      this.twitter.verifyCredentials(
        accessToken,
        accessTokenSecret,
        params,
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              consumerKey: this.consumerKey,
              consumerSecret: this.consumerSecret,
              accessToken,
              accessTokenSecret,
              user: data
            });
          }
        }
      );
    });
  }
}
