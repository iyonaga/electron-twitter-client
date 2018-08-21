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
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import Modal from './modal';
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
    logout: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
    this.onHomeClick = ::this.onHomeClick;
    this.onFavoriteClick = ::this.onFavoriteClick;
    this.onLogoutClick = ::this.onLogoutClick;
    this.getClass = ::this.getClass;
    this.openModal = ::this.openModal;
    this.closeModal = ::this.closeModal;
    this.confirmLogout = ::this.confirmLogout;
  }

  onHomeClick() {
    this.props.closeBox();
    this.props.getHomeTimeline();
  }

  onFavoriteClick() {
    this.props.closeBox();
    this.props.getFavoritesList();
  }

  async onLogoutClick() {
    await this.openModal();
    const confirm = await this.confirmLogout();
    if (confirm) {
      this.props.logout();
    } else {
      this.closeModal();
    }
  }

  getClass(menu) {
    return `${styles.menuItem} ${
      this.props.currentMenu === menu ? 'isActive' : ''
    }`;
  }

  openModal() {
    return new Promise(resolve => {
      this.setState(
        {
          isModalOpen: true
        },
        () => {
          resolve();
        }
      );
    });
  }

  closeModal() {
    this.setState({
      isModalOpen: false
    });
  }

  confirmLogout() {
    return new Promise(resolve => {
      this.logout.addEventListener(
        'click',
        () => {
          resolve(true);
        },
        { once: true }
      );

      this.cancel.addEventListener(
        'click',
        () => {
          resolve(false);
        },
        { once: true }
      );
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <ul className={`${styles.menuList} ${styles['menuList--top']}`}>
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
        </ul>

        <ul className={`${styles.menuList} ${styles['menuList--bottom']}`}>
          <li className={this.getClass()} onClick={this.onLogoutClick}>
            <span className={styles.menuIcon}>
              <FontAwesomeIcon icon={faSignOutAlt} className="fa-fw" />
            </span>
          </li>
        </ul>
        {this.state.isModalOpen && (
          <Modal closeModal={this.closeModal}>
            <div className={styles.logoutModal}>
              <div className={styles.logoutModalBody}>
                <span className={styles.logoutModalIcon}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="" />
                </span>
                <div className={styles.logoutModalText}>
                  <p className={styles.logoutModalTextHeading}>Logout</p>
                  <p>Are you sure you want to logout?</p>
                </div>
              </div>
              <div className={styles.logoutModalActions}>
                <button
                  className={`${styles.logoutModalAction} ${
                    styles['logoutModalAction--left']
                  }`}
                  ref={c => {
                    this.cancel = c;
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`${styles.logoutModalAction} ${
                    styles['logoutModalAction--right']
                  }`}
                  ref={c => {
                    this.logout = c;
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}
