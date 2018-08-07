import { connect } from 'react-redux';
import Tweet from '../components/tweet';
import { createTwitterClient } from '../utils/twitterClient';
import {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure,
  updateQuery
} from '../redux/modules/timeline';
import { toggleSearchBox } from '../redux/modules/sidebar';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    searchHashtag(hashtag) {
      dispatch(toggleSearchBox(true));
      dispatch(updateQuery(hashtag));

      createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client
          .searchTweets({ q: hashtag, count: 20, tweet_mode: 'extended' })
          .then(res => {
            dispatch(fetchTweetsSuccess(res.statuses));
          })
          .catch(error => {
            dispatch(fetchTweetsFailure(error));
          });
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tweet);
