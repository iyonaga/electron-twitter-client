import { connect } from 'react-redux';
import Sidebar from '../components/sidebar';
import { createTwitterClient } from '../utils/twitterClient';
import {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure
} from '../redux/modules/timeline';
import {
  toggleTweetBox,
  toggleSearchBox,
  toggleListsSelectBox
} from '../redux/modules/sidebar';

function mapStateToProps(state) {
  return {
    isTweetBoxOpen: state.sidebarReducer.isTweetBoxOpen,
    isSearchBoxOpen: state.sidebarReducer.isSearchBoxOpen,
    isListsSelectBoxOpen: state.sidebarReducer.isListsSelectBoxOpen
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeBox() {
      dispatch(toggleTweetBox(false));
      dispatch(toggleSearchBox(false));
      dispatch(toggleListsSelectBox(false));
    },

    toggleTweetBox() {
      dispatch(toggleTweetBox());
    },

    toggleSearchBox() {
      dispatch(toggleSearchBox());
    },

    toggleListsSelectBox() {
      dispatch(toggleListsSelectBox());
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

    getFavoritesList() {
      createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client
          .getFavoritesList({ tweet_mode: 'extended' })
          .then(tweets => {
            dispatch(fetchTweetsSuccess(tweets));
          })
          .catch(error => {
            dispatch(fetchTweetsFailure(error));
          });
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
