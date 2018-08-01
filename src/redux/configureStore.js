import { createStore, combineReducers } from 'redux';
import homeTimelineReducer from './modules/homeTimeLine';
import sidebarReducer from './modules/sidebar';

const reducer = combineReducers({
  homeTimelineReducer,
  sidebarReducer
});

export default function configureStore() {
  return createStore(reducer);
}
