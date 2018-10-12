// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import config from './config';
import genericTable from './genericTable';

const rootReducer = combineReducers({
  config,
  genericTable,
  router
});

export default rootReducer;
