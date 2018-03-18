import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { substr } from 'stringz';
import styles from './tweet.scss';

export default class Tweet extends PureComponent {
  static propTypes = {
    tweet: PropTypes.object.isRequired
  };

  static relativeTime(createdAt) {
    return Moment(new Date(createdAt)).fromNow();
  }

  linkedText() {
    const tweet = this.props.tweet.retweeted_status
      ? this.props.tweet.retweeted_status
      : this.props.tweet;

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
          text = `${substr(text, 0, entity.indices[0])}<a href="#">#${
            entity.text
          }</a>${substr(text, entity.indices[1])}`;
          break;
        case 'url':
          text = `${substr(text, 0, entity.indices[0])}<a href="#">${
            entity.display_url
          }</a>${substr(text, entity.indices[1])}`;
          break;
        case 'user_mention':
          text = `${substr(text, 0, entity.indices[0])}<a href="#">@${
            entity.screen_name
          }</a>${substr(text, entity.indices[1])}`;
          break;
        default:
          break;
      }
    });

    return text.replace(/\n/g, '<br>');
  }

  renderMedia() {
    const tweet = this.props.tweet.retweeted_status
      ? this.props.tweet.retweeted_status
      : this.props.tweet;

    if (!tweet.extended_entities) return false;

    return tweet.extended_entities.media.map(media => {
      if (media.type === 'photo') {
        return (
          <a href="#dummy" key={media.id_str}>
            <img src={media.media_url} alt="" />
          </a>
        );
      } else if (media.type === 'video' || media.type === 'animated_gif') {
        return (
          <video
            src={media.video_info.variants[0].url}
            poster={media.media_url}
            key={media.id_str}
            controls
          />
        );
      }
      return '';
    });
  }

  render() {
    const { tweet } = this.props;

    return (
      <li className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.header}>
            {(() => {
              if (tweet.retweeted_status) {
                return (
                  <p className={styles.retweetText}>
                    Retweeted by {tweet.user.name}
                  </p>
                );
              }
              return false;
            })()}
            <a href="#dummy" className={styles.profile}>
              <img
                className={styles['profile--userIcon']}
                src={tweet.user.profile_image_url}
                alt=""
              />
              <div className={styles['profile--nameGroup']}>
                <strong className={styles['profile--userName']}>
                  {tweet.user.name}
                </strong>
                <span className={styles['profile--screenName']}>
                  @{tweet.user.screen_name}
                </span>
              </div>
            </a>
            <div className={styles.time}>
              {Tweet.relativeTime(tweet.created_at)}
            </div>
          </div>

          <div className={styles.textContainer}>
            <div
              className={styles.tweetText}
              dangerouslySetInnerHTML={{
                __html: this.linkedText()
              }}
            />
            <div className={styles.mediaContainer}>{this.renderMedia()}</div>
          </div>

          <div className={styles.footer}>
            <ul className={styles.actions}>
              <li
                className={`${styles.actionItem} ${
                  styles['actionItem--retweet']
                }`}
              >
                retweet: {tweet.retweet_count}
              </li>
              <li
                className={`${styles.actionItem} ${
                  styles['actionItem--favorite']
                }`}
              >
                favorite: {tweet.favorite_count}
              </li>
            </ul>
          </div>
        </div>
      </li>
    );
  }
}
