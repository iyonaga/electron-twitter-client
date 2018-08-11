import { connect } from 'react-redux';
import { createTwitterClient } from '../utils/twitterClient';
import SearchBox from '../components/searchBox';
import {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure
} from '../redux/modules/timeline';

function mapStateToProps(state) {
  return {
    query: state.timelineReducer.query
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchTweets(query) {
      return createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client
          .searchTweets({ q: query, count: 20, tweet_mode: 'extended' })
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
