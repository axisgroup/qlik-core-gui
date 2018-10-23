// @flow
import React from 'react';
import { map, shareReplay, combineLatest } from 'rxjs/Operators';
import { componentFromStream } from '../../utils/observable-config';
import distinctProp from '../../utils/distinctProp';

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
    map(([props, layout]) => {
      console.log(props, layout);
      return (
        <div className="container">
          <div className="properties" />
        </div>
      );
    })
  );
});

export default GenericObjectDetail;
