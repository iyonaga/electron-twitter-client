import { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';

Moment.updateLocale('en', {
  relativeTime: {
    past: '%s',
    s: 'just now',
    ss: '%d seconds',
    m: '1 minute',
    mm: '%d minutes',
    h: '1 hour',
    hh: '%d hours'
  }
});

export default class Time extends Component {
  static propTypes = {
    createdAt: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      displayTime: this.getDisplayTime()
    };
  }

  componentDidMount() {
    if (!this.isMoreThanOneDay()) {
      this.timer = setInterval(::this.tick, 40000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getRelativeTime() {
    return this.getMomentTime().fromNow();
  }

  getAbsoluteTime() {
    if (this.isMoreThanOneYear()) {
      return this.getMomentTime().format('YYYY/M/D');
    }
    return this.getMomentTime().format('M/D');
  }

  getMomentTime() {
    return Moment(new Date(this.props.createdAt));
  }

  getDisplayTime() {
    if (this.isMoreThanOneDay()) {
      return this.getAbsoluteTime();
    }
    return this.getRelativeTime();
  }

  isMoreThanOneDay() {
    return this.getMomentTime().isBefore(Moment().subtract(1, 'day'));
  }

  isMoreThanOneYear() {
    return this.getMomentTime().isBefore(Moment().subtract(1, 'year'));
  }

  tick() {
    this.setState({
      displayTime: this.getDisplayTime()
    });
  }

  render() {
    return this.state.displayTime;
  }
}
