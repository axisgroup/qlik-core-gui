// @flow
import { SET_TAB } from '../actions/genericObjectDetails';
import type { Action, genericObjectDetailState } from './types';

export default function genericObjectDetails(
  state: genericObjectDetailState = {
    activeTab: 'overview'
  },
  action: Action
) {
  switch (action.type) {
    case SET_TAB: {
      const newTab = action.payload === null ? 'overview' : action.payload;
      return {
        ...state,
        activeTab: newTab
      };
    }

    default:
      return state;
  }
}
