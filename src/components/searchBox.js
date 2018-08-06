import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './searchBox.module.scss';

export default class SearchBox extends PureComponent {
  static propTypes = {
    searchTweets: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onInputKeyDown = ::this.onInputKeyDown;
    this.onClick = ::this.onClick;
  }

  componentDidMount() {
    this.input.focus();
  }

  onInputKeyDown(e) {
    let query = this.input.value;
    query = query.replace(/^\s+/g, '');

    if (query && e.key === 'Enter') {
      this.input.blur();
      this.props.searchTweets(query);
    }
  }

  onClick() {
    let query = this.input.value;
    query = query.replace(/^\s+/g, '');

    if (query) {
      this.input.blur();
      this.props.searchTweets(query);
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.searchBox}>
          <input
            type="text"
            ref={c => {
              this.input = c;
            }}
            className={styles.input}
            onKeyDown={e => this.onInputKeyDown(e)}
          />
          <button className={styles.button} onClick={this.onClick}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
    );
  }
}
