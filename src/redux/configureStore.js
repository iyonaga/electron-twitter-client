import { createStore, combineReducers } from 'redux';
import timelineReducer from './modules/timeline';
import sidebarReducer from './modules/sidebar';

const reducer = combineReducers({
  timelineReducer,
  sidebarReducer
});

export default function configureStore() {
  return createStore(reducer);
}
