import { connect } from 'react-redux';
import { createTwitterClient, getCurrentUser } from '../utils/twitterClient';
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
    getHomeTimeline() {
      createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client
          .getHomeTimeline({ count: 100, tweet_mode: 'extended' })
          .then(tweets => {
            dispatch(fetchTweetsSuccess(tweets));

            getCurrentUser().then(user => {
              client
                .getFrinendsIds({ user_id: user.id_str, stringify_ids: true })
                .then(res => {
                  const follow = [user.id_str, ...res.ids];
                  const params = {
                    follow: follow.join(',')
                  };

                  client.filterStream(params, tweet => {
                    let newTweet = tweet;

                    if (newTweet.in_reply_to_user_id_str === null) {
                      if (!follow.includes(newTweet.user.id_str)) {
                        return;
                      }

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
                    }
                  });
                });
            });
          })
          .catch(error => {
            dispatch(fetchTweetsFailure(error));
          });
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Contents);
