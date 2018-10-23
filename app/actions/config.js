// @flow
import type { Config } from '../reducers/types';

export const SET_CONFIG = 'SET_CONFIG';
export const REMOVE_CONFIG = 'REMOVE_CONFIG';

export function setConfig(config: Config) {
  return {
    type: SET_CONFIG,
    payload: config.port
      ? config
      : {
          host: config.host,
          appname: config.appname,
          isSecure: true
        }
  };
}

export function removeConfig() {
  return {
    type: REMOVE_CONFIG,
    payload: {}
  };
}
