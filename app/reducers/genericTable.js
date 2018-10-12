// @flow
import { TOGGLE_ROW, TOGGLE_EXPAND_ALL, SELECT_OBJ } from '../actions/genericTable';
import type { Action, genericTableState } from './types';

export default function genericTable(
  state: genericTableState = {
    expandedRows: [],
    selectedObj: '',
    expandAll: false
  },
  action: Action
) {
  switch (action.type) {
    case TOGGLE_ROW:
      const rows = state.expandedRows ? state.expandedRows : [];
      const rowSet = new Set(rows);
      rowSet.has(action.payload) ? rowSet.delete(action.payload) : rowSet.add(action.payload);
      let expandedRows = [];
      rowSet.forEach((val) => expandedRows.push(val));
      return {
        ...state,
        expandedRows,
        expandAll: false
      };

    case TOGGLE_EXPAND_ALL:
    return {
      ...state,
      expandAll: !state.expandAll,
      expandedRows: !state.expandAll ? state.expandedRows : []
    }

    case SELECT_OBJ:
    return {
      ...state,
      selectedObj: typeof action.payload === 'string' ? action.payload : ''
    }

    default:
      return state;
  }
}
