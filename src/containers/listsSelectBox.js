import { connect } from 'react-redux';
import { createTwitterClient } from '../utils/twitterClient';
import ListsSelectBox from '../components/listsSelectBox';
import {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure
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
        client
          .getListsStatuses({
            list_id: list.id_str,
            slug: list.slug,
            tweet_mode: 'extended'
          })
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

export default connect(mapStateToProps, mapDispatchToProps)(ListsSelectBox);
