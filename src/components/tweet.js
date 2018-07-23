import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { substr } from 'stringz';
import { Player, BigPlayButton } from 'video-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import styles from './tweet.module.scss';

export default class Tweet extends PureComponent {
  static propTypes = {
    tweet: PropTypes.object.isRequired
  };

  static relativeTime(createdAt) {
    return Moment(new Date(createdAt)).fromNow();
  }

  static renderFirstImage(url) {
    return (
      <div className={styles.imageItem}>
        <img src={url} alt="" />
      </div>
    );
  }

  static renderRemainingImage(media) {
    media.shift();
    return media.map(m => (
      <div className={styles.imageItem} key={m.id_str}>
        <img src={m.media_url} alt="" />
      </div>
    ));
  }

  static renderImages(entities) {
    const isMultiple = entities.media.length > 1;
    const numList = ['single', 'double', 'triple', 'quad'];
    const imageNum = numList[entities.media.length - 1];

    return (
      <div
        className={`${styles.imageContainer} ${
          styles[`imageContainer--${imageNum}`]
        } ${isMultiple ? styles.multipleImages : ''}`}
      >
        <div className={styles.imageContents}>
          {Tweet.renderFirstImage(entities.media[0].media_url)}
        </div>
        {isMultiple && (
          <div className={`${styles.imageContents}`}>
            {Tweet.renderRemainingImage(entities.media)}
          </div>
        )}
      </div>
    );
  }

  static renderVideo(video, thumbnail) {
    return (
      <div className={styles.videoContainer}>
        <Player muted poster={thumbnail} src={video.variants[0].url}>
          <BigPlayButton position="center" />
        </Player>
      </div>
    );
  }

  static renderMedia(tweet) {
    if (!tweet.extended_entities) return false;
    const entities = tweet.extended_entities;

    return (
      <div className={styles.mediaContainer}>
        {(() => {
          if (entities.media[0].video_info) {
            return Tweet.renderVideo(
              entities.media[0].video_info,
              entities.media[0].media_url_https
            );
          }
          return Tweet.renderImages(entities);
        })()}
      </div>
    );
  }

  static linkedText(tweet) {
    let text = substr(
      tweet.full_text,
      tweet.display_text_range[0],
      tweet.display_text_range[1]
    );

    const hashtags = tweet.entities.hashtags.map(hashtag => ({
      ...hashtag,
      type: 'hashtag'
    }));

    const urls = tweet.entities.urls.map(url => ({
      ...url,
      type: 'url'
    }));

    const userMentions = tweet.entities.user_mentions.map(userMention => ({
      ...userMention,
      type: 'user_mention'
    }));

    const newEntities = [...hashtags, ...urls, ...userMentions];

    const sortedEntities =
      newEntities.length > 0
        ? newEntities.sort((a, b) => b.indices[0] - a.indices[0])
        : [];

    sortedEntities.forEach(entity => {
      switch (entity.type) {
        case 'hashtag':
          text = `${substr(text, 0, entity.indices[0])}<a href="#" class=${
            styles.link
          }>#${entity.text}</a>${substr(text, entity.indices[1])}`;
          break;
        case 'url':
          text = `${substr(text, 0, entity.indices[0])}<a href="#" class=${
            styles.link
          }>${entity.display_url}</a>${substr(text, entity.indices[1])}`;
          break;
        case 'user_mention':
          text = `${substr(text, 0, entity.indices[0])}<a href="#" class=${
            styles.link
          }>@${entity.screen_name}</a>${substr(text, entity.indices[1])}`;
          break;
        default:
          break;
      }
    });

    return text.replace(/\n/g, '<br>');
  }

  isRetweet() {
    return !!this.props.tweet.retweeted_status;
  }

  renderHeader(tweet, user) {
    return (
      <div>
        {this.renderRetweetedText()}
        <a href="#dummy" className={styles.profile}>
          <img
            className={styles['profile--userIcon']}
            src={user.profile_image_url}
            alt=""
          />
          <div className={styles['profile--nameGroup']}>
            <strong className={styles['profile--userName']}>{user.name}</strong>
            <span className={styles['profile--screenName']}>
              @{user.screen_name}
            </span>
          </div>
        </a>
        <div className={styles.time}>
          {Tweet.relativeTime(tweet.created_at)}
        </div>
      </div>
    );
  }

  renderRetweetedText() {
    const { tweet } = this.props;
    if (!this.isRetweet()) return false;
    return (
      <div>
        <p className={styles.retweetText}>
          <FontAwesomeIcon icon={faRetweet} /> Retweeted by {tweet.user.name}
        </p>
      </div>
    );
  }

  renderContent() {
    const { tweet } = this.props;
    return tweet.retweeted_status
      ? this.renderTweet(tweet.retweeted_status, tweet.retweeted_status.user)
      : this.renderTweet(tweet, tweet.user);
  }

  renderTweet(tweet, user) {
    return (
      <div>
        <div className={styles.header}>{this.renderHeader(tweet, user)}</div>

        <div className={styles.textContainer}>
          <div
            className={styles.tweetText}
            dangerouslySetInnerHTML={{
              __html: Tweet.linkedText(tweet)
            }}
          />
          {Tweet.renderMedia(tweet)}
        </div>

        <div className={styles.footer}>
          <ul className={styles.actions}>
            <li
              className={`${styles.actionItem} ${
                tweet.retweeted ? styles['actionItem--retweeted'] : ''
              }`}
            >
              <FontAwesomeIcon icon={faRetweet} />{' '}
              <span className={styles.actionCount}>{tweet.retweet_count}</span>
            </li>
            <li
              className={`${styles.actionItem} ${
                tweet.favorited ? styles['actionItem--favorited'] : ''
              }`}
            >
              <FontAwesomeIcon icon={faHeart} />{' '}
              <span className={styles.actionCount}>{tweet.favorite_count}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  render() {
    return (
      <li className={styles.wrapper}>
        <div className={styles.content}>{this.renderContent()}</div>
      </li>
    );
  }
}
