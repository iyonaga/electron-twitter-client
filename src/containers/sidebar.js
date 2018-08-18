import { connect } from 'react-redux';
import Sidebar from '../components/sidebar';
import { createTwitterClient, getCurrentUser } from '../utils/twitterClient';
import {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure,
  addTweet,
  clearTimeline
} from '../redux/modules/timeline';
import {
  toggleTweetBox,
  toggleSearchBox,
  toggleListsSelectBox,
  updateCurrentMenu
} from '../redux/modules/sidebar';

function mapStateToProps(state) {
  return {
    currentMenu: state.sidebarReducer.currentMenu,
    isTweetBoxOpen: state.sidebarReducer.isTweetBoxOpen,
    isSearchBoxOpen: state.sidebarReducer.isSearchBoxOpen,
    isListsSelectBoxOpen: state.sidebarReducer.isListsSelectBoxOpen,
    savedTweets: state.timelineReducer.savedTweets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeBox() {
      dispatch(toggleTweetBox(false));
      dispatch(toggleSearchBox(false));
      dispatch(toggleListsSelectBox(false));
    },

    toggleTweetBox() {
      dispatch(toggleTweetBox());
    },

    toggleSearchBox() {
      dispatch(toggleSearchBox());
    },

    toggleListsSelectBox() {
      dispatch(toggleListsSelectBox());
    },

    getHomeTimeline() {
      dispatch(updateCurrentMenu('home'));
      createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client.stopStream();
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
    },

    getFavoritesList() {
      dispatch(updateCurrentMenu('favorite'));
      createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client.stopStream();
        client
          .getFavoritesList({ count: 100, tweet_mode: 'extended' })
          .then(tweets => {
            dispatch(fetchTweetsSuccess(tweets));
          })
          .catch(error => {
            dispatch(fetchTweetsFailure(error));
          });
      });
    },

    getMentionsTimeline() {
      dispatch(updateCurrentMenu('mentions'));
      createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client.stopStream();
        client
          .getMentionsTimeline({ count: 100, tweet_mode: 'extended' })
          .then(tweets => {
            dispatch(fetchTweetsSuccess(tweets));

            getCurrentUser().then(user => {
              const params = {
                follow: user.id_str
              };

              client.filterStream(params, tweet => {
                let newTweet = tweet;

                if (newTweet.in_reply_to_user_id_str === user.id_str) {
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
          })
          .catch(error => {
            dispatch(fetchTweetsFailure(error));
          });
      });
    },

    getSavedTweetsList(savedTweets) {
      dispatch(updateCurrentMenu('saved'));
      createTwitterClient().then(client => {
        dispatch(clearTimeline());
        client.stopStream();
        savedTweets.ids.forEach(id => {
          client.getTweet({ id, tweet_mode: 'extended' }).then(res => {
            dispatch(addTweet(res));
          });
        });
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
