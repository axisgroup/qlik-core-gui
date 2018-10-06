// @flow
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';
import { SET_CONFIG, REMOVE_CONFIG } from '../actions/config';
import type { Action, Config } from './types';

export default function config(state: Config = {}, action: Action) {
  switch (action.type) {
    case SET_CONFIG:
      return action.payload || {};
    case REMOVE_CONFIG:
      return {};
    default:
      return state;
  }
}
