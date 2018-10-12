// @flow
export const TOGGLE_ROW = 'TOGGLE_ROW';
export const SELECT_OBJ = 'SELECT_OBJ';
export const TOGGLE_EXPAND_ALL = 'TOGGLE_EXPAND_ALL';

export function toggleRow(rowName: string) {
  return {
    type: TOGGLE_ROW,
    payload: typeof rowName === 'string' ? rowName : null
  };
}

export function selectObj(obj: string) {
  return {
    type: SELECT_OBJ,
    payload: typeof obj === 'string' ? obj : null
  };
}

export function toggleExpandAll() {
  return {
    type: TOGGLE_EXPAND_ALL,
    payload: null
  };
}
