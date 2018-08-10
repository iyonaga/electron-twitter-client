import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { createTwitterClient } from '../utils/twitterClient';
import RetweetBox from './retweetBox';
import styles from './tweetFooter.module.scss';

export default class TweetFooter extends PureComponent {
  static propTypes = {
    tweet: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    const tweet = this.props.tweet.retweeted_status
      ? this.props.tweet.retweeted_status
      : this.props.tweet;

    this.state = {
      retweetCount: tweet.retweet_count,
      favoriteCount: tweet.favorite_count,
      isRetweeted: tweet.retweeted,
      isFavorited: tweet.favorited,
      isRetweetBoxOpen: false
    };

    this.closeRetweetBox = ::this.closeRetweetBox;
    this.onRetweetClick = ::this.onRetweetClick;
    this.onFavoriteClick = ::this.onFavoriteClick;
  }

  onRetweetClick() {
    if (this.state.isRetweeted) {
      createTwitterClient()
        .then(client => client.postUnRetweet(this.props.tweet.id_str))
        .then(() => {
          this.setState({
            retweetCount: (this.state.retweetCount -= 1),
            isRetweeted: false
          });
        });
    } else {
      this.setState({
        isRetweetBoxOpen: !this.state.isRetweetBoxOpen
      });
    }
  }

  onFavoriteClick() {
    const { tweet } = this.props;

    createTwitterClient()
      .then(client => {
        if (this.state.isFavorited) {
          return client.destroyFavorite(tweet.id_str);
        }
        return client.createFavorite(tweet.id_str);
      })
      .then(res => {
        this.setState({
          favoriteCount: res.favorite_count,
          isFavorited: res.favorited
        });
      });
  }

  closeRetweetBox(res) {
    this.setState({
      isRetweetBoxOpen: false,
      retweetCount: res.quoted_status
        ? res.quoted_status.retweet_count
        : res.retweet_count,
      isRetweeted: res.retweeted
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <ul className={styles.actions}>
          <li
            className={`${styles.actionItem} ${
              this.state.isRetweeted ? styles['actionItem--retweeted'] : ''
            }`}
            onClick={this.onRetweetClick}
          >
            <FontAwesomeIcon icon={faRetweet} />{' '}
            <span className={styles.actionCount}>
              {this.state.retweetCount.toLocaleString()}
            </span>
          </li>
          <li
            className={`${styles.actionItem} ${
              this.state.isFavorited ? styles['actionItem--favorited'] : ''
            }`}
            onClick={this.onFavoriteClick}
          >
            <FontAwesomeIcon icon={faHeart} />{' '}
            <span className={styles.actionCount}>
              {this.state.favoriteCount.toLocaleString()}
            </span>
          </li>
        </ul>
        {this.state.isRetweetBoxOpen && (
          <RetweetBox
            tweet={this.props.tweet}
            closeRetweetBox={this.closeRetweetBox}
          />
        )}
      </div>
    );
  }
}
