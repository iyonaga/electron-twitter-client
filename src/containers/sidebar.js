import { connect } from 'react-redux';
import Sidebar from '../components/sidebar';
import { toggleTweetBox } from '../redux/modules/sidebar';

function mapStateToProps(state) {
  return {
    isTweetBoxOpen: state.sidebarReducer.isTweetBoxOpen
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleTweetBox() {
      dispatch(toggleTweetBox());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
