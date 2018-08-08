import React from 'react';
import twitterText from 'twitter-text';
import { createTwitterClient } from '../utils/twitterClient';
import TweetBox from './tweetBox';
import EmojiPicker from './emojiPicker';
import styles from './retweetBox.module.scss';

export default class RetweetBox extends TweetBox {
  constructor(props) {
    super(props);
    this.state = {
      isTweetable: true
    };
    this.onChangeText = ::this.onChangeText;
    this.onPostRetweet = ::this.onPostRetweet;
  }

  onChangeText() {
    const text = this.textArea.value;
    const result = twitterText.parseTweet(text);
    this.updateProgressBar(result.permillage);
    this.setState({
      isTweetable: text.length === 0 ? true : result.valid
    });
  }

  onPostRetweet() {
    const { tweet } = this.props;

    createTwitterClient()
      .then(client => {
        if (this.textArea.value) {
          const url = `https://twitter.com/${tweet.user.screen_name}/status/${
            tweet.id_str
          }`;

          const params = {
            status: this.textArea.value,
            attachment_url: url
          };

          return client.postTweet(params);
        }
        return client.postRetweet(tweet.id_str);
      })
      .then(res => {
        this.props.closeRetweetBox(res);
      });
  }

  render() {
    return (
      <div className={styles.container}>
        <textarea
          ref={c => {
            this.textArea = c;
          }}
          rows="1"
          className={styles.textbox}
          onChange={this.onChangeText}
          placeholder="Add a comment..."
        />
        <div className={styles.toolbar}>
          <div className={styles.options}>
            <EmojiPicker onSelect={this.onSelectEmoji} />
          </div>
          <div className={styles.rightItems}>
            <div className={styles.progress}>
              <div className={styles.progressRight}>
                <span
                  className={styles.progressBar}
                  ref={c => {
                    this.progressBarRight = c;
                  }}
                />
              </div>
              <div className={styles.progressLeft}>
                <span
                  className={styles.progressBar}
                  ref={c => {
                    this.progressBarLeft = c;
                  }}
                />
              </div>
            </div>
            <button
              className={styles.tweetButton}
              onClick={this.onPostRetweet}
              disabled={!this.state.isTweetable}
            >
              Retweet
            </button>
          </div>
        </div>
      </div>
    );
  }
}
