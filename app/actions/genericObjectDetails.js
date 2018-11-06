// @flow
export const SET_TAB = 'SET_TAB';
export const SAVE_PROPS = 'SAVE_PROPS';

export function setTab(newTab: string) {
  return {
    type: SET_TAB,
    payload: typeof newTab === 'string' ? newTab : null
  };
}

export function saveProps(props: {}) {
  return {
    type: SAVE_PROPS,
    payload: props
  };
}
