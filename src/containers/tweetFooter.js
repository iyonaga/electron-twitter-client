import { connect } from 'react-redux';
import storage from 'electron-json-storage';
import TweetFooter from '../components/tweetFooter';
import { updateSavedTweets } from '../redux/modules/timeline';

function mapStateToProps(state) {
  return {
    savedTweets: state.timelineReducer.savedTweets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSavedTweets(savedTweets) {
      storage.set('savedTweets', savedTweets, error => {
        if (error) throw error;
        dispatch(updateSavedTweets(savedTweets));
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TweetFooter);
