// @flow
import React from 'react';
import { componentFromStream } from '../../../app/utils/observable-config';
import distinctProp from '../../../app/utils/distinctProp';
import {
  switchMap,
  map,
  tap,
  mergeMap,
  startWith,
  switchAll,
  shareReplay,
  switchMapTo,
  take,
  combineLatest
} from 'rxjs/Operators';
import { GetAllInfos, CreateSessionObject, GetObjects } from 'rxq/Doc';
import { GetLayout } from 'rxq/GenericObject';

import './genericObjDetail.css';

const GenericObjectDetail = componentFromStream(props$ => {
  // Grab the state and handlers
  const objProps$ = props$.pipe(
    distinctProp('objProps'),
    shareReplay(1)
  );

  // Grab the data
  const objLayout$ = props$.pipe(
    distinctProp('objLayout'),
    shareReplay(1)
  );

  // // Grab the headers
  // const headers$ = props$.pipe(
  //   distinctProp('headers'),
  //   shareReplay(1)
  // );

  return objProps$.pipe(
    combineLatest(objLayout$),
    map(([props,layout]) => {
      console.log(props,layout);
      return (
        <div className='container'>
          <div className='properties'>
            
          </div>
        </div>
      );
    })
  );
});

export default GenericObjectDetail;
