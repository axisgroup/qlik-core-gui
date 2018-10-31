// @flow
import React from 'react';
import { map } from 'rxjs/Operators';
import ReactJson from 'react-json-view';
import { componentFromStream } from '../../../utils/observable-config';

import './genericObjPropEditor.css';

const GenericObjectPropEditor = componentFromStream(props$ => {
  // function that returns the display of the object layout
  const displayObjLayout = objProperties => (
    <ReactJson
      src={objProperties}
      name={null}
      onEdit={() => true}
      onAdd={() => true}
      onDelete={() => true}
    />
  );

  return props$.pipe(
    map(({ objProps }) => {
      const content = objProps
        ? displayObjLayout(objProps)
        : 'No Object Selected';
      return <div className="genericObjProperties">{content}</div>;
    })
  );
});

export default GenericObjectPropEditor;
