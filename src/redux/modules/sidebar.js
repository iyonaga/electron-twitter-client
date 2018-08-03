import { createActions, handleActions } from 'redux-actions';

const TOGGLE_TWEET_BOX = 'TOGGLE_TWEET_BOX';

export const { toggleTweetBox } = createActions(TOGGLE_TWEET_BOX);

const initialState = {
  isTweetBoxOpen: false
};

const sidebarReducer = handleActions(
  {
    TOGGLE_TWEET_BOX: state => ({
      isTweetBoxOpen: !state.isTweetBoxOpen
    })
  },
  initialState
);

export default sidebarReducer;
