import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { shell } from 'electron';
import { Player, BigPlayButton } from 'video-react';
import twemoji from 'twemoji';
import TweetHeader from './tweetHeader';
import TweetFooter from './tweetFooter';
import styles from './tweet.module.scss';

export default class Tweet extends PureComponent {
  static propTypes = {
    tweet: PropTypes.object.isRequired,
    searchHashtag: PropTypes.func.isRequired
  };

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

  static onLinkClick(e) {
    const url = e.currentTarget.getAttribute('href');
    e.preventDefault();
    shell.openExternal(url);
  }

  constructor(props) {
    super(props);
    this.linkedText = ::this.linkedText;
    this.onHashtagClick = ::this.onHashtagClick;
  }

  componentDidMount() {
    twemoji.parse(this.content);
  }

  onHashtagClick(e) {
    const hashtag = e.target.getAttribute('href');
    e.preventDefault();
    this.props.searchHashtag(hashtag);
  }

  linkedText(tweet) {
    const isReply = !!tweet.in_reply_to_status_id;

    let text = [...tweet.full_text]
      .slice(tweet.display_text_range[0], tweet.display_text_range[1])
      .join('');

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

    if (!newEntities.length) {
      return text;
    }

    const sortedEntities =
      newEntities.length > 0
        ? newEntities.sort((a, b) => b.indices[0] - a.indices[0])
        : [];

    const linkedText = [];

    sortedEntities.forEach(entity => {
      linkedText.push(
        <Fragment key={entity.indices[0]}>
          {this.renderLink(entity, isReply, tweet)}
          {[...text].slice(entity.indices[1]).join('')}
        </Fragment>
      );

      text = [...text].slice(0, entity.indices[0]).join('');
    });

    linkedText.push(text);

    return linkedText.reverse();
  }

  renderLink(entity, isReply, tweet) {
    let link = '';

    switch (entity.type) {
      case 'hashtag':
        link = (
          <a
            href={`#${entity.text}`}
            className={styles.link}
            onClick={this.onHashtagClick}
          >
            #{entity.text}
          </a>
        );
        break;

      case 'url':
        link = (
          <a
            href={entity.url}
            className={styles.link}
            onClick={this.onLinkClick}
          >
            {entity.display_url}
          </a>
        );
        break;

      case 'user_mention':
        link =
          isReply && entity.id_str === tweet.in_reply_to_user_id_str ? (
            <Fragment>
              <span className={styles.replyText}>
                Replying to{' '}
                <a
                  href={`https://twitter.com/${tweet.in_reply_to_screen_name}`}
                  className={styles.link}
                >
                  @{tweet.in_reply_to_screen_name}
                </a>
              </span>
              <br />
            </Fragment>
          ) : (
            <a
              href={`https://twitter.com/${entity.screen_name}`}
              className={styles.link}
              onClick={this.onLinkClick}
            >
              @{entity.screen_name}
            </a>
          );
        break;

      default:
        break;
    }

    return link;
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
        <TweetHeader
          tweet={this.props.tweet}
          user={user}
          onLinkClick={Tweet.onLinkClick}
          onHashtagClick={this.onHashtagClick}
        />
        <div className={styles.textContainer}>
          <div className={styles.tweetText}>{this.linkedText(tweet)}</div>
          {Tweet.renderMedia(tweet)}
        </div>
        <TweetFooter tweet={this.props.tweet} />
      </div>
    );
  }

  render() {
    return (
      <li className={styles.wrapper}>
        <div
          className={styles.content}
          ref={c => {
            this.content = c;
          }}
        >
          {this.renderContent()}
        </div>
      </li>
    );
  }
}
