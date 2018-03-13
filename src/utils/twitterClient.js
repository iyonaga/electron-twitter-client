import Twit from 'twit';

export default class TwitterClient {
  constructor(accounts) {
    this.client = new Twit({
      consumer_key: accounts.consumerKey,
      consumer_secret: accounts.consumerSecret,
      access_token: accounts.accessToken,
      access_token_secret: accounts.accessTokenSecret,
      timeout_ms: 60 * 1000
    });
  }

  postTweet(status) {
    return new Promise((resolve, reject) => {
      this.client.post('statuses/update', { status }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  destroyTweet(id) {
    return new Promise((resolve, reject) => {
      this.client.post('statuses/destroy/:id', { id }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  getTweet(id) {
    return new Promise((resolve, reject) => {
      this.client.get('statuses/show/:id', { id }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  postRetweet(id) {
    return new Promise((resolve, reject) => {
      this.client.post('statuses/retweet/:id', { id }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  postUnRetweet(id) {
    return new Promise((resolve, reject) => {
      this.client.post('statuses/unretweet/:id', { id }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  createFavorite(id) {
    return new Promise((resolve, reject) => {
      this.client.post('favorites/create', { id }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  destroyFavorite(id) {
    return new Promise((resolve, reject) => {
      this.client.post('favorites/destroy', { id }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  getFavoritesList(params) {
    return new Promise((resolve, reject) => {
      this.client('favorites/list', params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  searchTweets(q, count) {
    return new Promise((resolve, reject) => {
      this.client.get('search/tweets', { q, count }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  userStream(callback) {
    const stream = this.client.stream('user');
    stream.on('tweet', tweet => {
      callback(tweet);
    });
  }

  filterStream(track, callback) {
    const stream = this.client.stream('statuses/filter', { track });
    stream.on('tweet', tweet => {
      callback(tweet);
    });
  }

  getHomeTimeLine(params) {
    return new Promise((resolve, reject) => {
      this.client.get('statuses/home_timeline', params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  getMentionsTimeLine(params) {
    return new Promise((resolve, reject) => {
      this.client.get('statuses/mentions_timeline', params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }
}
