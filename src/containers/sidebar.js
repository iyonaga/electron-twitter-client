import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import Sidebar from '../components/sidebar';
import { createTwitterClient } from '../utils/twitterClient';
import { homeTimelineStream, mentionsStream } from '../utils/stream';
import {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure,
  addTweet
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

    async getHomeTimeline() {
      dispatch(updateCurrentMenu('home'));

      const client = await createTwitterClient();
      client.stopStream();
      dispatch(fetchTweetsRequest());

      try {
        const tweets = await client.getHomeTimeline({
          count: 100,
          tweet_mode: 'extended'
        });
        dispatch(fetchTweetsSuccess(tweets));

        homeTimelineStream(tweet => {
          dispatch(addTweet(tweet));
        });
      } catch (error) {
        dispatch(fetchTweetsFailure(error));
      }
    },

    async getFavoritesList() {
      dispatch(updateCurrentMenu('favorite'));

      const client = await createTwitterClient();
      client.stopStream();
      dispatch(fetchTweetsRequest());

      try {
        const tweets = await client.getFavoritesList({
          count: 100,
          tweet_mode: 'extended'
        });
        dispatch(fetchTweetsSuccess(tweets));
      } catch (error) {
        dispatch(fetchTweetsFailure(error));
      }
    },

    async getMentionsTimeline() {
      dispatch(updateCurrentMenu('mentions'));

      const client = await createTwitterClient();
      client.stopStream();
      dispatch(fetchTweetsRequest());

      try {
        const tweets = await client.getMentionsTimeline({
          count: 100,
          tweet_mode: 'extended'
        });
        dispatch(fetchTweetsSuccess(tweets));

        mentionsStream(tweet => {
          dispatch(addTweet(tweet));
        });
      } catch (error) {
        dispatch(fetchTweetsFailure(error));
      }
    },

    logout() {
      ipcRenderer.send('removeAccount');
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
