import { connect } from 'react-redux';
import { createTwitterClient } from '../utils/twitterClient';
import Contents from '../components/contents';
import {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure
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
    getHomeTimeline() {
      createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client
          .getHomeTimeline({ tweet_mode: 'extended' })
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

export default connect(mapStateToProps, mapDispatchToProps)(Contents);
