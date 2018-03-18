import React, { Component } from 'react';
import storage from 'electron-json-storage';
import TwitterClient from '../utils/twitterClient';
import Tweet from '../components/tweet';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      tweets: []
    };
  }

  componentDidMount() {
    storage.get('accounts', (error, data) => {
      if (error) throw error;

      const client = new TwitterClient(data);
      client.getHomeTimeLine({ tweet_mode: 'extended' }).then(tweets => {
        this.setState({
          tweets
        });
        console.log(tweets);
      });
    });
  }

  render() {
    return (
      <ul>
        {this.state.tweets.map(tweet => (
          <Tweet key={tweet.id_str} tweet={tweet} />
        ))}
      </ul>
    );
  }
}
