import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tweet from './tweet';
import styles from './contents.module.scss';

export default class Contents extends Component {
  static propTypes = {
    getHomeTimeline: PropTypes.func.isRequired,
    tweets: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.getHomeTimeline();
  }

  render() {
    return (
      <ul className={styles.container}>
        {this.props.tweets.map(tweet => (
          <Tweet key={tweet.id_str} tweet={tweet} />
        ))}
      </ul>
    );
  }
}
