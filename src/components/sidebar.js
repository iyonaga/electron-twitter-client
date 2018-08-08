import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faSearch,
  faHome,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import styles from './sidebar.module.scss';

export default class Sidebar extends PureComponent {
  static propTypes = {
    closeBox: PropTypes.func.isRequired,
    toggleTweetBox: PropTypes.func.isRequired,
    toggleSearchBox: PropTypes.func.isRequired,
    getHomeTimeline: PropTypes.func.isRequired,
    getFavoritesList: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onHomeClick = ::this.onHomeClick;
    this.onFavoriteClick = ::this.onFavoriteClick;
  }

  onHomeClick() {
    this.props.closeBox();
    this.props.getHomeTimeline();
  }

  onFavoriteClick() {
    this.props.closeBox();
    this.props.getFavoritesList();
  }

  render() {
    return (
      <div className={styles.container}>
        <ul className={styles.menuList}>
          <li className={styles.menuItem} onClick={this.props.toggleTweetBox}>
            <span className={(styles.menuIcon, styles['menuIcon--edit'])}>
              <FontAwesomeIcon icon={faEdit} className="fa-fw" />
            </span>
          </li>
          <li className={styles.menuItem} onClick={this.props.toggleSearchBox}>
            <span className={(styles.menuIcon, styles['menuIcon--search'])}>
              <FontAwesomeIcon icon={faSearch} className="fa-fw" />
            </span>
          </li>
          <li className={styles.menuItem} onClick={this.onHomeClick}>
            <span className={(styles.menuIcon, styles['menuIcon--home'])}>
              <FontAwesomeIcon icon={faHome} className="fa-fw" />
            </span>
          </li>
          <li className={styles.menuItem} onClick={this.onFavoriteClick}>
            <span className={(styles.menuIcon, styles['menuIcon--favorite'])}>
              <FontAwesomeIcon icon={faHeart} className="fa-fw" />
            </span>
          </li>
        </ul>
      </div>
    );
  }
}
