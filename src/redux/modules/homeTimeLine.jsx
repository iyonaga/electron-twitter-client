export const getHomeTimeline = tweets => ({
  type: 'GET_HOME_TIMELINE',
  payload: tweets
});

const initialState = {
  tweets: []
};

export default function homeTimelineReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_HOME_TIMELINE':
      return Object.assign({}, state, {
        tweets: action.payload
      });
    default:
      return state;
  }
}
