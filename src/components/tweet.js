import React, { PureComponent } from 'react';
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

  static linkedText(tweet) {
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

    const sortedEntities =
      newEntities.length > 0
        ? newEntities.sort((a, b) => b.indices[0] - a.indices[0])
        : [];

    sortedEntities.forEach(entity => {
      switch (entity.type) {
        case 'hashtag':
          text = `${[...text].slice(0, entity.indices[0]).join('')}<a href="#${
            entity.text
          }" class="${styles.link} js-hashtag">#${entity.text}</a>${[...text]
            .slice(entity.indices[1])
            .join('')}`;
          break;

        case 'url':
          text = `${[...text].slice(0, entity.indices[0]).join('')}<a href="${
            entity.url
          }" class="${styles.link} js-link">${entity.display_url}</a>${[...text]
            .slice(entity.indices[1])
            .join('')}`;
          break;

        case 'user_mention':
          if (isReply && entity.id_str === tweet.in_reply_to_user_id_str) {
            text = `<span class="${
              styles.replyText
            }">Replying to <a href="https://twitter.com/${
              tweet.in_reply_to_screen_name
            }" class="${styles.link} js-link">@${
              tweet.in_reply_to_screen_name
            }</a></span><br>${text}`;
          } else {
            text = `${[...text]
              .slice(0, entity.indices[0])
              .join('')}<a href="https://twitter.com/${
              entity.screen_name
            }" class="${styles.link} js-link">@${entity.screen_name}</a>${[
              ...text
            ]
              .slice(entity.indices[1])
              .join('')}`;
          }
          break;

        default:
          break;
      }
    });

    return text.replace(/\n/g, '<br>');
  }

  static applyEmoji(tweet) {
    return twemoji.parse(tweet);
  }

  static onLinkClick(e) {
    const url = e.currentTarget.getAttribute('href');
    e.preventDefault();
    shell.openExternal(url);
  }

  constructor(props) {
    super(props);
    this.onHashtagClick = ::this.onHashtagClick;
  }

  componentDidMount() {
    const links = this.tweetText.querySelectorAll('.js-link');
    const hashtags = this.tweetText.querySelectorAll('.js-hashtag');

    if (links.length) {
      for (let i = 0; i < links.length; i += 1) {
        links[i].addEventListener('click', Tweet.onLinkClick, false);
      }
    }

    if (hashtags.length) {
      for (let i = 0; i < hashtags.length; i += 1) {
        hashtags[i].addEventListener('click', this.onHashtagClick, false);
      }
    }
  }

  componentWillUnmount() {
    const links = this.tweetText.querySelectorAll('.js-link');
    const hashtags = this.tweetText.querySelectorAll('.js-hashtag');

    if (links.length) {
      for (let i = 0; i < links.length; i += 1) {
        links[i].removeEventListener('click', Tweet.onLinkClick);
      }
    }

    if (hashtags.length) {
      for (let i = 0; i < hashtags.length; i += 1) {
        hashtags[i].removeEventListener('click', this.onHashtagClick);
      }
    }
  }

  onHashtagClick(e) {
    const hashtag = e.target.getAttribute('href');
    e.preventDefault();
    this.props.searchHashtag(hashtag);
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
        />
        <div className={styles.textContainer}>
          <div
            className={styles.tweetText}
            ref={c => {
              this.tweetText = c;
            }}
            dangerouslySetInnerHTML={{
              __html: Tweet.applyEmoji(Tweet.linkedText(tweet))
            }}
          />
          {Tweet.renderMedia(tweet)}
        </div>
        <TweetFooter tweet={this.props.tweet} />
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
