import { connect } from 'react-redux';
import Tweet from '../components/tweet';
import { createTwitterClient } from '../utils/twitterClient';
import { searchStream } from '../utils/stream';
import {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure,
  addTweet,
  updateQuery
} from '../redux/modules/timeline';
import { updateCurrentMenu, toggleSearchBox } from '../redux/modules/sidebar';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    async searchHashtag(hashtag) {
      dispatch(updateCurrentMenu('search'));
      dispatch(toggleSearchBox(true));
      dispatch(updateQuery(hashtag));

      const client = await createTwitterClient();
      client.stopStream();
      dispatch(fetchTweetsRequest());

      try {
        const res = await client.searchTweets({
          q: hashtag,
          count: 20,
          tweet_mode: 'extended',
          exclude: 'retweets'
        });
        dispatch(fetchTweetsSuccess(res.statuses));

        searchStream(hashtag, tweet => {
          dispatch(addTweet(tweet));
        });
      } catch (error) {
        dispatch(fetchTweetsFailure(error));
      }
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tweet);
