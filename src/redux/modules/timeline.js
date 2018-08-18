import { createActions, handleActions } from 'redux-actions';

export const {
  fetchTweetsRequest,
  fetchTweetsSuccess,
  fetchTweetsFailure,
  updateQuery,
  addTweet,
  updateSavedTweets,
  clearTimeline
} = createActions(
  'FETCH_TWEETS_REQUEST',
  'FETCH_TWEETS_SUCCESS',
  'FETCH_TWEETS_FAILURE',
  'UPDATE_QUERY',
  'ADD_TWEET',
  'UPDATE_SAVED_TWEETS',
  'CLEAR_TIMELINE'
);

const initialState = {
  isFetching: false,
  tweets: [],
  savedTweets: { ids: [] },
  isError: false,
  error: {},
  query: ''
};

const timelineReducer = handleActions(
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
    }),

    [updateQuery]: (state, action) => ({
      ...state,
      query: action.payload
    }),

    [addTweet]: (state, action) => ({
      ...state,
      tweets: [action.payload, ...state.tweets]
    }),

    [updateSavedTweets]: (state, action) => ({
      ...state,
      savedTweets: action.payload
    }),

    [clearTimeline]: state => ({
      ...state,
      tweets: []
    })
  },
  initialState
);

export default timelineReducer;
