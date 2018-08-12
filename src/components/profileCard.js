import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import twitterText from 'twitter-text';
import { createTwitterClient } from '../utils/twitterClient';
import styles from './profileCard.module.scss';

export default class ProfileCard extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    placement: PropTypes.string.isRequired,
    onLinkClick: PropTypes.func.isRequired,
    onHashtagClick: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isFollowing: props.user.following,
      followButtonText: ''
    };
    this.onMouseOver = ::this.onMouseOver;
    this.onMouseLeave = ::this.onMouseLeave;
    this.onFollowButtonClick = ::this.onFollowButtonClick;
    this.linkedText = ::this.linkedText;
    this.renderLink = ::this.renderLink;
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

  linkedText(user) {
    let { description } = user;

    const entities = twitterText.extractEntitiesWithIndices(user.description, {
      extractUrlsWithoutProtocol: false
    });

    if (!entities.length) {
      return description;
    }

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

    const linkedText = [];

    sortedEntities.forEach(entity => {
      linkedText.push(
        <Fragment key={entity.indices[0]}>
          {this.renderLink(entity)}
          {description.substring(entity.indices[1])}
        </Fragment>
      );

      description = description.substring(0, entity.indices[0]);
    });

    linkedText.push(description);

    return linkedText.reverse();
  }

  renderLink(entity) {
    let link = '';

    switch (entity.type) {
      case 'hashtag':
        link = (
          <a
            href={`#${entity.hashtag}`}
            className={styles.link}
            onClick={this.props.onHashtagClick}
          >
            #{entity.hashtag}
          </a>
        );
        break;

      case 'url':
        link = (
          <a
            href={entity.url}
            className={styles.link}
            onClick={this.props.onLinkClick}
          >
            {entity.url}
          </a>
        );
        break;

      case 'user_mention':
        link = (
          <a
            href={`https://twitter.com/${entity.screenName}`}
            className={styles.link}
            onClick={this.props.onLinkClick}
          >
            @{entity.screenName}
          </a>
        );
        break;

      default:
        break;
    }

    return link;
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
            <a
              href={`https://twitter.com/${user.screen_name}`}
              className={`${styles.userNameWrapper} 'js-link'`}
              onClick={this.props.onLinkClick}
            >
              <strong className={styles.userName}>{user.name}</strong>
              <span className={styles.screenName}>@{user.screen_name}</span>
            </a>
            <div className={styles.description}>{this.linkedText(user)}</div>
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
