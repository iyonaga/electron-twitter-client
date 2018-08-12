import { createActions, handleActions } from 'redux-actions';

export const {
  toggleTweetBox,
  toggleSearchBox,
  toggleListsSelectBox,
  updateCurrentMenu
} = createActions(
  {
    TOGGLE_TWEET_BOX: display => ({ display }),
    TOGGLE_SEARCH_BOX: display => ({ display }),
    TOGGLE_LISTS_SELECT_BOX: display => ({ display })
  },
  'UPDATE_CURRENT_MENU'
);

const initialState = {
  isTweetBoxOpen: false,
  isSearchBoxOpen: false,
  isListsSelectBoxOpen: false,
  currentMenu: 'home'
};

const sidebarReducer = handleActions(
  {
    [toggleTweetBox]: (state, action) => ({
      ...state,
      isTweetBoxOpen:
        typeof action.payload.display === 'undefined'
          ? !state.isTweetBoxOpen
          : action.payload.display,
      isSearchBoxOpen: false,
      isListsSelectBoxOpen: false
    }),

    [toggleSearchBox]: (state, action) => ({
      ...state,
      isTweetBoxOpen: false,
      isSearchBoxOpen:
        typeof action.payload.display === 'undefined'
          ? !state.isSearchBoxOpen
          : action.payload.display,
      isListsSelectBoxOpen: false
    }),

    [toggleListsSelectBox]: (state, action) => ({
      ...state,
      isTweetBoxOpen: false,
      isSearchBoxOpen: false,
      isListsSelectBoxOpen:
        typeof action.payload.display === 'undefined'
          ? !state.isListsSelectBoxOpen
          : action.payload.display
    }),

    [updateCurrentMenu]: (state, action) => ({
      ...state,
      currentMenu: action.payload
    })
  },
  initialState
);

export default sidebarReducer;
