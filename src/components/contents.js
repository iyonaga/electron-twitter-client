import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import TweetBox from './tweetBox';
import SearchBox from '../containers/searchBox';
import Tweet from '../containers/tweet';
import styles from './contents.module.scss';

export default class Contents extends Component {
  static propTypes = {
    getHomeTimeline: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    tweets: PropTypes.array.isRequired,
    isError: PropTypes.bool.isRequired,
    error: PropTypes.object.isRequired,
    isTweetBoxOpen: PropTypes.bool.isRequired,
    isSearchBoxOpen: PropTypes.bool.isRequired
  };

  componentDidMount() {
    this.props.getHomeTimeline();
  }

  renderTimeline() {
    if (this.props.isError) {
      return (
        <div className={styles.error}>
          <div className={styles.errorMessage}>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <p>{this.props.error.message}</p>
          </div>
        </div>
      );
    }

    return (
      <ul>
        {this.props.tweets.map(tweet => (
          <Tweet key={tweet.id_str} tweet={tweet} />
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        {this.props.isTweetBoxOpen && <TweetBox />}
        {this.props.isSearchBoxOpen && <SearchBox />}
        {this.props.isFetching ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        ) : (
          this.renderTimeline()
        )}
      </div>
    );
  }
}
