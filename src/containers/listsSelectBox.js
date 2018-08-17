import { connect } from 'react-redux';
import { createTwitterClient } from '../utils/twitterClient';
import ListsSelectBox from '../components/listsSelectBox';
import {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure,
  addTweet
} from '../redux/modules/timeline';
import { updateCurrentMenu } from '../redux/modules/sidebar';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    getListsStatuses(list) {
      dispatch(updateCurrentMenu('lists'));
      createTwitterClient().then(client => {
        dispatch(fetchTweetsRequest());
        client.stopStream();
        client
          .getListsStatuses({
            list_id: list.id_str,
            // slug: list.slug,
            tweet_mode: 'extended'
          })
          .then(tweets => {
            dispatch(fetchTweetsSuccess(tweets));

            client
              .getListsMembers({ list_id: list.id_str, count: 5000 })
              .then(res => {
                const follow = res.users.map(user => user.id_str);
                const params = {
                  follow: follow.join(',')
                };

                client.filterStream(params, tweet => {
                  let newTweet = tweet;

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

export default connect(mapStateToProps, mapDispatchToProps)(ListsSelectBox);
