import { connect } from 'react-redux';
import { createTwitterClient } from '../utils/twitterClient';
import { homeTimelineStream } from '../utils/stream';
import Contents from '../components/contents';
import {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure,
  addTweet
} from '../redux/modules/timeline';

function mapStateToProps(state) {
  return {
    isFetching: state.timelineReducer.isFetching,
    tweets: state.timelineReducer.tweets,
    isError: state.timelineReducer.isError,
    error: state.timelineReducer.error,
    isTweetBoxOpen: state.sidebarReducer.isTweetBoxOpen,
    isSearchBoxOpen: state.sidebarReducer.isSearchBoxOpen,
    isListsSelectBoxOpen: state.sidebarReducer.isListsSelectBoxOpen
  };
}

function mapDispatchToProps(dispatch) {
  return {
    async getHomeTimeline() {
      const client = await createTwitterClient();
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
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Contents);
