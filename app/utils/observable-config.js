import { from, Observable } from 'rxjs';
import React, { ReactNode } from 'react';
import {
  componentFromStreamWithConfig,
  mapPropsStreamWithConfig,
  createEventHandlerWithConfig
} from 'recompose';

const rxjsConfig = {
  fromESObservable: from,
  toESObservable: o => o
};

const componentFromStream = componentFromStreamWithConfig(rxjsConfig);

const mapPropsStream = mapPropsStreamWithConfig(rxjsConfig);

const createEventHandler = createEventHandlerWithConfig(rxjsConfig);

export { componentFromStream, mapPropsStream, createEventHandler };
