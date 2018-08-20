import { connect } from 'react-redux';
import { createTwitterClient } from '../utils/twitterClient';
import { searchStream } from '../utils/stream';
import SearchBox from '../components/searchBox';
import {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure,
  addTweet
} from '../redux/modules/timeline';
import { updateCurrentMenu } from '../redux/modules/sidebar';

function mapStateToProps(state) {
  return {
    query: state.timelineReducer.query
  };
}

function mapDispatchToProps(dispatch) {
  return {
    async searchTweets(query) {
      dispatch(updateCurrentMenu('search'));

      const client = await createTwitterClient();
      client.stopStream();
      dispatch(fetchTweetsRequest());

      try {
        const res = await client.searchTweets({
          q: query,
          count: 100,
          tweet_mode: 'extended',
          exclude: 'retweets'
        });
        dispatch(fetchTweetsSuccess(res.statuses));

        searchStream(query, tweet => {
          dispatch(addTweet(tweet));
        });
      } catch (error) {
        dispatch(fetchTweetsFailure(error));
      }
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
