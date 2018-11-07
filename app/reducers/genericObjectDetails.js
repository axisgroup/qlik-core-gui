// @flow
import { SET_TAB, SAVE_PROPS } from '../actions/genericObjectDetails';
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

    case SAVE_PROPS: {
      return {
        ...state,
        currProps: JSON.parse(JSON.stringify(action.payload))
      };
    }

    default:
      return state;
  }
}
