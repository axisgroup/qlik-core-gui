// @flow

import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type appState = {
  +config: Config,
  +counter: number
}

export type Config = {
  +host?: string,
  +port?: number,
  +appname?: string
}

export type counterStateType = {
  +counter: number
};

export type Action = {
  type: string,
  payload?: any
};

export type GetState = () => appState;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
