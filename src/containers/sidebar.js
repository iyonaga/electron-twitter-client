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
  toggleListsSelectBox,
  updateCurrentMenu
} from '../redux/modules/sidebar';

function mapStateToProps(state) {
  return {
    currentMenu: state.sidebarReducer.currentMenu,
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
      dispatch(updateCurrentMenu('home'));
      createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client
          .getHomeTimeline({ count: 100, tweet_mode: 'extended' })
          .then(tweets => {
            dispatch(fetchTweetsSuccess(tweets));
          })
          .catch(error => {
            dispatch(fetchTweetsFailure(error));
          });
      });
    },

    getFavoritesList() {
      dispatch(updateCurrentMenu('favorite'));
      createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client
          .getFavoritesList({ count: 100, tweet_mode: 'extended' })
          .then(tweets => {
            dispatch(fetchTweetsSuccess(tweets));
          })
          .catch(error => {
            dispatch(fetchTweetsFailure(error));
          });
      });
    },

    getMentionsTimeline() {
      dispatch(updateCurrentMenu('mentions'));
      createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client
          .getMentionsTimeline({ count: 100, tweet_mode: 'extended' })
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
