import { connect } from 'react-redux';
import storage from 'electron-json-storage';
import TwitterClient from '../utils/twitterClient';
import Contents from '../components/contents';
import { getHomeTimeline } from '../redux/modules/homeTimeLine';

function mapStateToProps(state) {
  return {
    tweets: state.homeTimelineReducer.tweets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getHomeTimeline() {
      storage.get('accounts', (error, data) => {
        if (error) throw error;

        const client = new TwitterClient(data);
        client.getHomeTimeLine({ tweet_mode: 'extended' }).then(tweets => {
          console.log(tweets);
          dispatch(getHomeTimeline(tweets));
        });
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Contents);
