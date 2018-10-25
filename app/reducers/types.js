// @flow

import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type appState = {
  +config: Config,
  +genericTable: genericTableState
};

export type Config = {
  +host?: string,
  +port?: number,
  +appname?: string
};

export type genericTableState = {
  expandedRows: string[],
  selectedObj: string,
  expandAll?: boolean
};

export type genericObjectDetailState = {
  activeTab: string
};

export type Action = {
  type: string,
  payload?: any
};

export type GetState = () => appState;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
