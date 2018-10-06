// @flow
export const SET_CONFIG = 'SET_CONFIG';
export const REMOVE_CONFIG = 'REMOVE_CONFIG';

import type { Config } from '../reducers/types';

export function setConfig(config: Config) {
  return {
    type: SET_CONFIG,
    config
  };
}

export function removeConfig() {
  return {
    type: REMOVE_CONFIG,
    config: {}
  };
}
