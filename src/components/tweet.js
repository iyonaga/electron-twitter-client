import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { shell } from 'electron';
import { Player, BigPlayButton } from 'video-react';
import twemoji from 'twemoji';
import TweetHeader from './tweetHeader';
import TweetFooter from '../containers/tweetFooter';
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

  static renderQuoteTweet(tweet) {
    if (!tweet.is_quote_status || !tweet.quoted_status_permalink) return false;
    return (
      <div className={styles.quoteTweetContainer}>
        <a
          href={tweet.quoted_status_permalink.url}
          className={styles.quoteTweetLink}
          onClick={this.onLinkClick}
        >
          <div className={styles.quoteTweetInner}>
            <div className={styles.quoteTweetAuthor}>
              <strong className={styles.quoteTweetUserName}>
                {tweet.quoted_status.user.name}
              </strong>
              <span className={styles.quoteTweetScreenName}>
                @{tweet.quoted_status.user.screen_name}
              </span>
            </div>
            <div>
              {tweet.quoted_status.full_text || tweet.quoted_status.text}
            </div>
          </div>
        </a>
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
    let text = tweet.display_text_range
      ? [...tweet.full_text]
          .slice(tweet.display_text_range[0], tweet.display_text_range[1])
          .join('')
      : tweet.full_text;

    const hashtags = tweet.entities.hashtags.map(hashtag => ({
      ...hashtag,
      type: 'hashtag'
    }));

    const urls = tweet.entities.urls
      .filter(url => {
        if (
          tweet.is_quote_status &&
          tweet.quoted_status_permalink &&
          url.url === tweet.quoted_status_permalink.url &&
          url.indices[0] > [...text].length
        ) {
          return false;
        }

        return true;
      })
      .map(url => ({
        ...url,
        type: 'url'
      }));

    const replys = [];

    const userMentions = tweet.entities.user_mentions
      .filter(userMention => {
        if (
          tweet.in_reply_to_status_id &&
          tweet.display_text_range &&
          tweet.display_text_range[0] > userMention.indices[1]
        ) {
          replys.push(userMention);
          return false;
        }

        return true;
      })
      .map(userMention => ({
        ...userMention,
        type: 'user_mention'
      }));

    const newEntities = [...hashtags, ...urls, ...userMentions];

    if (!replys.length && !newEntities.length) {
      return text;
    }

    const sortedEntities =
      newEntities.length > 0
        ? newEntities.sort((a, b) => b.indices[0] - a.indices[0])
        : [];

    const linkedText = [];

    sortedEntities.forEach(entity => {
      linkedText.unshift(
        <Fragment key={JSON.stringify(entity)}>
          {this.renderLink(entity)}
          {[...text].slice(entity.indices[1]).join('')}
        </Fragment>
      );

      text = [...text].slice(0, entity.indices[0]).join('');
    });

    linkedText.unshift(text);

    if (replys.length) {
      linkedText.unshift(
        <Fragment key={JSON.stringify(replys)}>
          <span className={styles.replyText}>
            Replying to{' '}
            {replys.map((reply, index) => (
              <Fragment key={reply.id}>
                <a
                  href={`https://twitter.com/${reply.screen_name}`}
                  className={styles.link}
                  onClick={Tweet.onLinkClick}
                >
                  @{reply.screen_name}
                </a>
                {replys.length !== index + 1 && ' '}
              </Fragment>
            ))}
          </span>
          <br />
        </Fragment>
      );
    }

    return linkedText;
  }

  renderLink(entity) {
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
            onClick={Tweet.onLinkClick}
          >
            {entity.display_url}
          </a>
        );
        break;

      case 'user_mention':
        link = (
          <a
            href={`https://twitter.com/${entity.screen_name}`}
            className={styles.link}
            onClick={Tweet.onLinkClick}
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
          {Tweet.renderQuoteTweet(tweet)}
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
