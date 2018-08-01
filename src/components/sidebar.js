import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './sidebar.module.scss';

export default class Sidebar extends PureComponent {
  static propTypes = {
    toggleTweetBox: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className={styles.container}>
        <ul className={styles.menuList}>
          <li className={styles.menuItem} onClick={this.props.toggleTweetBox}>
            <span className={(styles.menuIcon, styles['menuIcon--edit'])}>
              <FontAwesomeIcon icon={faEdit} className="fa-fw" />
            </span>
          </li>
          <li className={styles.menuItem}>
            <span className={(styles.menuIcon, styles['menuIcon--home'])}>
              <FontAwesomeIcon icon={faHome} className="fa-fw" />
            </span>
          </li>
          <li className={styles.menuItem}>
            <span className={(styles.menuIcon, styles['menuIcon--search'])}>
              <FontAwesomeIcon icon={faSearch} className="fa-fw" />
            </span>
          </li>
        </ul>
      </div>
    );
  }
}
