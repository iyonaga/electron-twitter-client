import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { getCurrentUser } from '../utils/twitterClient';
import ProfileCard from './profileCard';
import styles from './tweetHeader.module.scss';

export default class TweetHeader extends PureComponent {
  static propTypes = {
    tweet: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onLinkClick: PropTypes.func.isRequired
  };

  static biggerProfileImage(url) {
    return url.replace(/_normal/, '_bigger');
  }

  static relativeTime(createdAt) {
    return Moment(new Date(createdAt)).fromNow();
  }

  constructor(props) {
    super(props);
    this.state = {
      isProfileLinkHover: false,
      profileCardPosition: {},
      profileCardPlacement: 'bottom'
    };

    this.timer = null;
    this.onMouseOver = ::this.onMouseOver;
    this.onMouseLeave = ::this.onMouseLeave;
    this.getRenderPosition = ::this.getRenderPosition;
    this.isMyTweet = ::this.isMyTweet;
  }

  onMouseOver(e) {
    this.isMyTweet(this.props.tweet)
      .then(() => {
        clearTimeout(this.timer);
      })
      .catch(() => {});

    if (this.state.isProfileLinkHover) {
      clearTimeout(this.timer);
      return;
    }

    const {
      isBottomPlacement,
      beforePosition,
      afterPosition
    } = this.getRenderPosition(e);

    this.setState({
      profileCardPosition: beforePosition,
      profileCardPlacement: isBottomPlacement ? 'bottom' : 'top'
    });

    this.timer = setTimeout(() => {
      this.setState({
        isProfileLinkHover: true,
        profileCardPosition: afterPosition
      });
    }, 500);
  }

  onMouseLeave() {
    if (!this.state.isProfileLinkHover) {
      clearTimeout(this.timer);
    } else {
      this.timer = setTimeout(() => {
        this.setState({
          isProfileLinkHover: false
        });
      }, 300);
    }
  }

  getRenderPosition(e) {
    const beforePosition = {};
    const afterPosition = {};
    const windowHeight = window.innerHeight;
    const profileCardHeight = this.profileCard.clientHeight;
    const profileLinkRect = this.profileLink.getBoundingClientRect();
    const profileLinkOffsetLeft = this.profileLink.offsetLeft;
    const userIconHeight = this.userIcon.clientHeight;
    const isMouseOverUserIcon = e.pageX < profileLinkRect.left;
    const isBottomPlacement =
      windowHeight - profileLinkRect.bottom >= profileCardHeight ||
      profileCardHeight > profileLinkRect.top;
    const offset = 15;

    if (isBottomPlacement) {
      afterPosition.top = isMouseOverUserIcon
        ? userIconHeight
        : profileLinkRect.bottom - profileLinkRect.top;
      beforePosition.top = `${afterPosition.top + offset}px`;
    } else {
      afterPosition.top = `-${profileCardHeight}`;
      beforePosition.top = `${afterPosition.top - offset}px`;
    }

    afterPosition.top = `${afterPosition.top}px`;
    afterPosition.left = isMouseOverUserIcon ? 0 : `${profileLinkOffsetLeft}px`;
    beforePosition.left = afterPosition.left;

    return {
      isBottomPlacement,
      beforePosition,
      afterPosition
    };
  }

  isMyTweet() {
    return getCurrentUser().then(currentUser => {
      if (currentUser.id_str === this.props.tweet.user.id_str) {
        return Promise.resolve();
      }
      return Promise.reject();
    });
  }

  isRetweet() {
    return !!this.props.tweet.retweeted_status;
  }

  renderRetweetedText() {
    if (!this.isRetweet()) return false;
    return (
      <p className={styles.retweetText}>
        <FontAwesomeIcon icon={faRetweet} /> Retweeted by{' '}
        {this.props.tweet.user.name}
      </p>
    );
  }

  render() {
    const { tweet, user } = this.props;
    return (
      <div className={styles.container}>
        {this.renderRetweetedText()}
        <div className={styles.content}>
          <a
            href={`https://twitter.com/${user.screen_name}`}
            className={styles.profileLink}
            onClick={this.props.onLinkClick}
            onMouseEnter={this.onMouseOver}
            onMouseLeave={this.onMouseLeave}
            onFocus={() => false}
            ref={c => {
              this.profileLink = c;
            }}
          >
            <img
              className={styles.userIcon}
              src={TweetHeader.biggerProfileImage(user.profile_image_url)}
              ref={c => {
                this.userIcon = c;
              }}
              alt=""
            />
            <div className={styles.userNameContainer}>
              <strong className={styles.userName}>{user.name}</strong>
              <span className={styles.screenName}>@{user.screen_name}</span>
            </div>
          </a>
          <div className={styles.time}>
            {TweetHeader.relativeTime(tweet.created_at)}
          </div>
          <div
            className={`${styles.profileCardContainer} ${
              this.state.isProfileLinkHover
                ? styles['profileCardContainer--hover']
                : ''
            }`}
            style={this.state.profileCardPosition}
            ref={c => {
              this.profileCard = c;
            }}
          >
            <ProfileCard
              user={user}
              placement={this.state.profileCardPlacement}
            />
          </div>
        </div>
      </div>
    );
  }
}
