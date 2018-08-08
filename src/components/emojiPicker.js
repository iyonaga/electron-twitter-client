import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrinAlt } from '@fortawesome/free-regular-svg-icons';
import styles from './emojiPicker.module.scss';

export default class EmojiPicker extends PureComponent {
  static propTypes = {
    onSelect: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpenPicker: false
    };

    this.onTogglePicker = ::this.onTogglePicker;
    this.onClosePicker = ::this.onClosePicker;
  }

  componentDidMount() {
    document.addEventListener('click', this.onClosePicker);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClosePicker);
  }

  onTogglePicker() {
    this.setState({
      isOpenPicker: !this.state.isOpenPicker
    });
  }

  onClosePicker(e) {
    if (this.toggleButton.contains(e.target)) {
      return;
    }

    if (!this.picker || !this.picker.contains(e.target)) {
      this.setState({
        isOpenPicker: false
      });
    }
  }

  render() {
    return (
      <div className={styles.emojiPicker}>
        <button
          ref={c => {
            this.toggleButton = c;
          }}
          className={styles.toggleButton}
          onClick={this.onTogglePicker}
        >
          <FontAwesomeIcon icon={faGrinAlt} />
        </button>
        {this.state.isOpenPicker && (
          <div
            ref={c => {
              this.picker = c;
            }}
          >
            <Picker
              emojiSize={18}
              set="twitter"
              showPreview={false}
              onSelect={this.props.onSelect}
            />
          </div>
        )}
      </div>
    );
  }
}
