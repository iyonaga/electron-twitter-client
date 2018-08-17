import { connect } from 'react-redux';
import { createTwitterClient } from '../utils/twitterClient';
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
    searchTweets(query) {
      dispatch(updateCurrentMenu('search'));
      return createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client.stopStream();
        client
          .searchTweets({ q: query, count: 100, tweet_mode: 'extended' })
          .then(res => {
            dispatch(fetchTweetsSuccess(res.statuses));

            const params = {
              track: query
            };

            client.filterStream(params, tweet => {
              let newTweet = tweet;

              if (tweet.retweeted_status) {
                newTweet.retweeted_status.full_text =
                  newTweet.retweeted_status.text;
              } else {
                newTweet.full_text = newTweet.text;
              }

              if (newTweet.extended_tweet) {
                newTweet = { ...newTweet, ...newTweet.extended_tweet };
              }

              dispatch(addTweet(newTweet));
            });
          })
          .catch(error => {
            dispatch(fetchTweetsFailure(error));
          });
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
