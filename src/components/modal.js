import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styles from './modal.module.scss';

export default class Modal extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    closeModal: PropTypes.func.isRequired
  };

  static onContentClick(e) {
    e.stopPropagation();
  }

  constructor(props) {
    super(props);
    this.rootEl = document.getElementById('app');
    this.onContainerClick = ::this.onContainerClick;
  }

  componentWillMount() {
    document.querySelector('html').classList.add('isModalOpen');
  }

  componentWillUnmount() {
    document.querySelector('html').classList.remove('isModalOpen');
  }

  onContainerClick() {
    this.props.closeModal();
  }

  render() {
    return ReactDOM.createPortal(
      <div
        className={styles.container}
        onClick={this.onContainerClick}
        role="presentation"
      >
        <div
          className={styles.content}
          onClick={Modal.onContentClick}
          role="dialog"
        >
          {this.props.children}
        </div>
      </div>,
      this.rootEl
    );
  }
}
