// @flow
export const SET_TAB = 'SET_TAB';

export function setTab(newTab: string) {
  return {
    type: SET_TAB,
    payload: typeof newTab === 'string' ? newTab : null
  };
}
