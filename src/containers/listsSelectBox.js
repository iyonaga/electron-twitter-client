import { connect } from 'react-redux';
import { createTwitterClient } from '../utils/twitterClient';
import { listStream } from '../utils/stream';
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
    async getListsStatuses(list) {
      dispatch(updateCurrentMenu('lists'));

      const client = await createTwitterClient();
      client.stopStream();
      dispatch(fetchTweetsRequest());

      try {
        const tweets = await client.getListsStatuses({
          list_id: list.id_str,
          tweet_mode: 'extended'
        });
        dispatch(fetchTweetsSuccess(tweets));

        listStream(list.id_str, tweet => {
          dispatch(addTweet(tweet));
        });
      } catch (error) {
        dispatch(fetchTweetsFailure(error));
      }
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListsSelectBox);
