// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import config from './config';
import genericTable from './genericTable';
import genericObjectDetails from './genericObjectDetails';

const rootReducer = combineReducers({
  config,
  genericTable,
  genericObjectDetails,
  router
});

export default rootReducer;
