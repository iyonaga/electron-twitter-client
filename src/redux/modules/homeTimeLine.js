import { createActions, handleActions } from 'redux-actions';

const GET_HOME_TIMELINE = 'GET_HOME_TIMELINE';

export const { getHomeTimeline } = createActions(GET_HOME_TIMELINE);

const initialState = {
  tweets: []
};

const homeTimelineReducer = handleActions(
  {
    GET_HOME_TIMELINE: (state, action) =>
      Object.assign({}, state, {
        tweets: action.payload
      })
  },
  initialState
);

export default homeTimelineReducer;
