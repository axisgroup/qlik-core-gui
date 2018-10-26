// @flow
import React from 'react';
import { map } from 'rxjs/Operators';
import ReactJson from 'react-json-view';
import { componentFromStream } from '../../../utils/observable-config';

import './genericObjLayout.css';

const GenericObjectLayout = componentFromStream(props$ => {
  // function that returns the display of the object layout
  const displayObjLayout = objLayout => (
    <ReactJson src={objLayout} name={null} />
  );

  return props$.pipe(
    map(({ objLayout }) => {
      const objLayoutOnly = objLayout;
      if (objLayoutOnly && objLayoutOnly.qHyperCube) {
        delete objLayoutOnly.qHyperCube.qGrandTotalRow;
        delete objLayoutOnly.qHyperCube.qDataPages;
        delete objLayoutOnly.qHyperCube.qPivotDataPages;
        delete objLayoutOnly.qHyperCube.qStackedDataPages;
      }
      const content = objLayoutOnly
        ? displayObjLayout(objLayoutOnly)
        : 'No Object Selected';
      return <div className="genericObjProperties">{content}</div>;
    })
  );
});

export default GenericObjectLayout;
