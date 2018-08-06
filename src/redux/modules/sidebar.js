import { createActions, handleActions } from 'redux-actions';

export const { toggleTweetBox, toggleSearchBox } = createActions({
  TOGGLE_TWEET_BOX: display => ({ display }),
  TOGGLE_SEARCH_BOX: display => ({ display })
});

const initialState = {
  isTweetBoxOpen: false,
  isSearchBoxOpen: false
};

const sidebarReducer = handleActions(
  {
    [toggleTweetBox]: (state, action) => ({
      ...state,
      isTweetBoxOpen:
        typeof action.payload.display === 'undefined'
          ? !state.isTweetBoxOpen
          : action.payload.display,
      isSearchBoxOpen: false
    }),

    [toggleSearchBox]: (state, action) => ({
      ...state,
      isTweetBoxOpen: false,
      isSearchBoxOpen:
        typeof action.payload.display === 'undefined'
          ? !state.isSearchBoxOpen
          : action.payload.display
    })
  },
  initialState
);

export default sidebarReducer;