import { createStore, combineReducers } from 'redux';
import homeTimelineReducer from './modules/homeTimeLine';

const reducer = combineReducers({
  homeTimelineReducer
});

export default function configureStore() {
  return createStore(reducer);
}
