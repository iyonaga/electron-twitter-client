import { connect } from 'react-redux';
import Sidebar from '../components/sidebar';
import { createTwitterClient } from '../utils/twitterClient';
import {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure
} from '../redux/modules/timeline';
import { toggleTweetBox, toggleSearchBox } from '../redux/modules/sidebar';

function mapStateToProps(state) {
  return {
    isTweetBoxOpen: state.sidebarReducer.isTweetBoxOpen,
    isSearchBoxOpen: state.sidebarReducer.isSearchBoxOpen
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeBox() {
      dispatch(toggleTweetBox(false));
      dispatch(toggleSearchBox(false));
    },

    getHomeTimeline() {
      createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client
          .getHomeTimeLine({ tweet_mode: 'extended' })
          .then(tweets => {
            dispatch(fetchTweetsSuccess(tweets));
          })
          .catch(error => {
            dispatch(fetchTweetsFailure(error));
          });
      });
    },

    toggleTweetBox() {
      dispatch(toggleTweetBox());
    },

    toggleSearchBox() {
      dispatch(toggleSearchBox());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
