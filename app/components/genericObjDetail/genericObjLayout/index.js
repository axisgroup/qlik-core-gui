// @flow
import React from 'react';
import { map } from 'rxjs/Operators';
import { componentFromStream } from '../../../utils/observable-config';

import './genericObjLayout.css';

const GenericObjectLayout = componentFromStream(props$ => {
  // function that returns the display of the object layout
  const displayObjLayout = objLayout => (
    <pre>{JSON.stringify(objLayout, null, 2)}</pre>
  );

  return props$.pipe(
    map(({ objLayout }) => {
      const content = objLayout
        ? displayObjLayout(objLayout)
        : 'No Object Selected';
      return <div className="genericObjProperties">{content}</div>;
    })
  );
});

export default GenericObjectLayout;
