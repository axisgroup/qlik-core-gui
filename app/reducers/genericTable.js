// @flow
import {
  TOGGLE_ROW,
  TOGGLE_EXPAND_ALL,
  SELECT_OBJ,
  SAVE_SEARCH_TERM
} from '../actions/genericTable';
import type { Action, genericTableState } from './types';

export default function genericTable(
  state: genericTableState = {
    expandedRows: [],
    selectedObj: '',
    expandAll: false,
    searchTerm: ''
  },
  action: Action
) {
  switch (action.type) {
    case TOGGLE_ROW: {
      const rows = state.expandedRows ? state.expandedRows : [];
      const rowSet = new Set(rows);
      if (rowSet.has(action.payload)) rowSet.delete(action.payload);
      else rowSet.add(action.payload);
      const expandedRows = [];
      rowSet.forEach(val => expandedRows.push(val));
      return {
        ...state,
        expandedRows,
        expandAll: false
      };
    }

    case TOGGLE_EXPAND_ALL: {
      const newExpand =
        typeof action.payload === 'boolean' ? action.payload : !state.expandAll;

      return {
        ...state,
        expandAll: newExpand,
        expandedRows: newExpand ? state.expandedRows : []
      };
    }

    case SELECT_OBJ:
      return {
        ...state,
        selectedObj: typeof action.payload === 'string' ? action.payload : ''
      };

    case SAVE_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };

    default:
      return state;
  }
}
