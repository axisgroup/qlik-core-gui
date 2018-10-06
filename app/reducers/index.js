// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import config from './config';

const rootReducer = combineReducers({
  counter,
  config,
  router
});

export default rootReducer;
