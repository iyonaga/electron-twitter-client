import { createActions, handleActions } from 'redux-actions';

export const {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure
} = createActions(
  'FETCH_TWEETS_REQUEST',
  'FETCH_TWEETS_SUCCESS',
  'FETCH_TWEETS_FAILURE'
);

const initialState = {
  isFetching: false,
  tweets: [],
  isError: false,
  error: {}
};

const homeTimelineReducer = handleActions(
  {
    [fetchTweetsRequest]: state => ({
      ...state,
      isFetching: true
    }),

    [fetchTweetsSuccess]: (state, action) => ({
      ...state,
      isFetching: false,
      isError: false,
      tweets: action.payload
    }),

    [fetchTweetsFailure]: (state, action) => ({
      ...state,
      isFetching: false,
      isError: action.error,
      error: action.payload
    })
  },
  initialState
);

export default homeTimelineReducer;
