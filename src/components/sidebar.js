import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faSearch,
  faHome,
  faHeart,
  faListUl,
  faAt,
  faBookmark
} from '@fortawesome/free-solid-svg-icons';
import styles from './sidebar.module.scss';

export default class Sidebar extends PureComponent {
  static propTypes = {
    currentMenu: PropTypes.string.isRequired,
    closeBox: PropTypes.func.isRequired,
    toggleTweetBox: PropTypes.func.isRequired,
    toggleSearchBox: PropTypes.func.isRequired,
    toggleListsSelectBox: PropTypes.func.isRequired,
    getHomeTimeline: PropTypes.func.isRequired,
    getFavoritesList: PropTypes.func.isRequired,
    getMentionsTimeline: PropTypes.func.isRequired,
    getSavedTweetsList: PropTypes.func.isRequired,
    savedTweets: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.getClass = ::this.getClass;
    this.onHomeClick = ::this.onHomeClick;
    this.onFavoriteClick = ::this.onFavoriteClick;
    this.onSavedClick = ::this.onSavedClick;
  }

  onHomeClick() {
    this.props.closeBox();
    this.props.getHomeTimeline();
  }

  onFavoriteClick() {
    this.props.closeBox();
    this.props.getFavoritesList();
  }

  onSavedClick() {
    this.props.closeBox();
    this.props.getSavedTweetsList(this.props.savedTweets);
  }

  getClass(menu) {
    return `${styles.menuItem} ${
      this.props.currentMenu === menu ? 'isActive' : ''
    }`;
  }

  render() {
    return (
      <div className={styles.container}>
        <ul className={styles.menuList}>
          <li
            className={this.getClass('tweet')}
            onClick={this.props.toggleTweetBox}
          >
            <span className={(styles.menuIcon, styles['menuIcon--edit'])}>
              <FontAwesomeIcon icon={faEdit} className="fa-fw" />
            </span>
          </li>
          <li
            className={this.getClass('search')}
            onClick={this.props.toggleSearchBox}
          >
            <span className={styles.menuIcon}>
              <FontAwesomeIcon icon={faSearch} className="fa-fw" />
            </span>
          </li>
          <li className={this.getClass('home')} onClick={this.onHomeClick}>
            <span className={styles.menuIcon}>
              <FontAwesomeIcon icon={faHome} className="fa-fw" />
            </span>
          </li>
          <li
            className={this.getClass('favorite')}
            onClick={this.onFavoriteClick}
          >
            <span className={styles.menuIcon}>
              <FontAwesomeIcon icon={faHeart} className="fa-fw" />
            </span>
          </li>
          <li
            className={this.getClass('lists')}
            onClick={this.props.toggleListsSelectBox}
          >
            <span className={styles.menuIcon}>
              <FontAwesomeIcon icon={faListUl} className="fa-fw" />
            </span>
          </li>
          <li
            className={this.getClass('mentions')}
            onClick={this.props.getMentionsTimeline}
          >
            <span className={styles.menuIcon}>
              <FontAwesomeIcon icon={faAt} className="fa-fw" />
            </span>
          </li>
          <li className={this.getClass('saved')} onClick={this.onSavedClick}>
            <span className={styles.menuIcon}>
              <FontAwesomeIcon icon={faBookmark} className="fa-fw" />
            </span>
          </li>
        </ul>
      </div>
    );
  }
}
