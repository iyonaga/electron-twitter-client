import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createTwitterClient, getUser } from '../utils/twitterClient';
import styles from './listsSelectBox.module.scss';

export default class ListsSelectBox extends PureComponent {
  static propTypes = {
    getListsStatuses: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      placeholder: ''
    };
    this.onChange = ::this.onChange;
  }

  componentDidMount() {
    getUser()
      .then(user =>
        createTwitterClient().then(client =>
          client.getMyLists({ user_id: user.id_str })
        )
      )
      .then(lists => {
        this.setState({
          lists,
          placeholder: lists.length
            ? 'Please Chose...'
            : "You don't have any lists."
        });
      });
  }

  onChange(e) {
    const list = this.state.lists[e.target.value];
    this.props.getListsStatuses(list);
  }

  render() {
    return (
      <div className={styles.container}>
        <div
          className={`${styles.selectWrapper} ${
            this.state.lists.length ? '' : styles['selectWrapper--noLists']
          }`}
        >
          <select
            className={styles.select}
            defaultValue=""
            onChange={this.onChange}
          >
            <option className={styles.placeholder} disabled value="">
              {this.state.placeholder}
            </option>
            {this.state.lists.map((list, index) => (
              <option key={list.id_str} value={index}>
                {list.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}
