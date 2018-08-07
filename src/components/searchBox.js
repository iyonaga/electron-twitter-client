import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './searchBox.module.scss';

export default class SearchBox extends PureComponent {
  static propTypes = {
    query: PropTypes.string.isRequired,
    searchTweets: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      inputText: ''
    };
    this.onInputKeyDown = ::this.onInputKeyDown;
    this.onClick = ::this.onClick;
    this.onInputChange = ::this.onInputChange;
  }

  componentDidMount() {
    this.input.focus();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      inputText: nextProps.query
    });
  }

  onInputChange(e) {
    this.setState({
      inputText: e.target.value
    });
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
            value={this.state.inputText}
            onChange={this.onInputChange}
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
