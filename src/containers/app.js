import { connect } from 'react-redux';
import App from '../components/app';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
