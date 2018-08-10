import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import twitterText from 'twitter-text';
import twemoji from 'twemoji';
import { createTwitterClient } from '../utils/twitterClient';
import styles from './profileCard.module.scss';

export default class ProfileCard extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    placement: PropTypes.string.isRequired
  };

  static linkedText(user) {
    let { description } = user;

    const entities = twitterText.extractEntitiesWithIndices(user.description, {
      extractUrlsWithoutProtocol: false
    });

    const newEntities = entities.map(entity => {
      if (entity.hashtag) {
        return {
          ...entity,
          type: 'hashtag'
        };
      } else if (entity.url) {
        return {
          ...entity,
          type: 'url'
        };
      } else if (entity.screenName) {
        return {
          ...entity,
          type: 'user_mention'
        };
      }
      return { ...entity };
    });

    const sortedEntities =
      newEntities.length > 0
        ? newEntities.sort((a, b) => b.indices[0] - a.indices[0])
        : [];

    sortedEntities.forEach(entity => {
      switch (entity.type) {
        case 'hashtag':
          description = `${description.substring(
            0,
            entity.indices[0]
          )}<a href="#${entity.hashtag}" class="${styles.link} js-hashtag">#${
            entity.hashtag
          }</a>${description.substring(entity.indices[1])}`;
          break;
        case 'url':
          description = `${description.substring(
            0,
            entity.indices[0]
          )}<a href="${entity.url}" class="${styles.link} js-link">${
            entity.url
          }</a>${description.substring(entity.indices[1])}`;
          break;
        case 'user_mention':
          description = `${description.substring(
            0,
            entity.indices[0]
          )}<a href="https://twitter.com/${entity.screenName}" class="${
            styles.link
          } js-link">@${entity.screenName}</a>${description.substring(
            entity.indices[1]
          )}`;
          break;
        default:
          break;
      }
    });

    return description;
  }

  constructor(props) {
    super(props);
    this.state = {
      isFollowing: props.user.following,
      followButtonText: ''
    };
    this.onMouseOver = ::this.onMouseOver;
    this.onMouseLeave = ::this.onMouseLeave;
    this.onFollowButtonClick = ::this.onFollowButtonClick;
  }

  componentWillMount() {
    this.onMouseLeave();
  }

  onMouseOver() {
    this.setState({
      followButtonText: this.state.isFollowing ? 'Unfollow' : 'Follow'
    });
  }

  onMouseLeave() {
    this.setState({
      followButtonText: this.state.isFollowing ? 'Following' : 'Follow'
    });
  }

  onFollowButtonClick(e) {
    const id = e.target.value;
    createTwitterClient()
      .then(client => {
        if (this.state.isFollowing) {
          return client.destroyFollow(id);
        }
        return client.createFollow(id);
      })
      .then(res => {
        this.setState({
          isFollowing: !res.following
        });
      });
  }

  renderArrow(user) {
    if (this.props.placement === 'bottom') {
      return (
        <div className={styles.arrowTop}>
          <div
            className={styles.arrowBg}
            style={{ background: `#${user.profile_link_color}` }}
          >
            {user.profile_banner_url && (
              <img src={user.profile_banner_url} alt="" />
            )}
          </div>
          <span className={styles.shadow} />
        </div>
      );
    }

    return <div className={styles.arrowBottom} />;
  }

  render() {
    const { user } = this.props;

    return (
      <div className={styles.container}>
        {this.renderArrow(user)}
        <div className={styles.header}>
          <div
            className={styles.headerImage}
            style={{ background: `#${user.profile_link_color}` }}
          >
            {user.profile_banner_url && (
              <img src={user.profile_banner_url} alt="" />
            )}
          </div>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <div className={styles.userIcon}>
              <img
                src={user.profile_image_url_https.replace(/_normal/, '_bigger')}
                alt=""
              />
            </div>
            <div className={styles.actions}>
              <button
                className={`${styles.followButton} ${
                  this.state.isFollowing
                    ? styles['followButton--following']
                    : ''
                }`}
                onClick={this.onFollowButtonClick}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}
                onFocus={() => false}
                value={user.id_str}
              >
                {this.state.followButtonText}
              </button>
            </div>
            <div className={styles.userNameWrapper}>
              <strong className={styles.userName}>{user.name}</strong>
              <span className={styles.screenName}>@{user.screen_name}</span>
            </div>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{
                __html: twemoji.parse(ProfileCard.linkedText(user))
              }}
            />
          </div>
        </div>

        <ul className={styles.stats}>
          <li>
            <span className={styles.statsLabel}>Tweets</span>
            <span className={styles.statsValue}>
              {this.props.user.statuses_count.toLocaleString()}
            </span>
          </li>
          <li>
            <span className={styles.statsLabel}>Following</span>
            <span className={styles.statsValue}>
              {this.props.user.friends_count.toLocaleString()}
            </span>
          </li>
          <li>
            <span className={styles.statsLabel}>Followers</span>
            <span className={styles.statsValue}>
              {this.props.user.followers_count.toLocaleString()}
            </span>
          </li>
        </ul>
      </div>
    );
  }
}
