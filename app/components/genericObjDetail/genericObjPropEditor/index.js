// @flow
import React from 'react';
import { map } from 'rxjs/Operators';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { componentFromStream } from '../../../utils/observable-config';

import './genericObjPropEditor.css';

const GenericObjectPropEditor = componentFromStream(props$ => {
  // function that returns the display of the object layout
  const displayObjLayout = objProperties => (
    // <pre>{JSON.stringify(objLayout, null, 2)}</pre>
    <JSONInput
      id="unique"
      placeholder={objProperties}
      height="100%"
      locale={locale}
      theme="light_mitsuketa_tribute"
      onChange={res => console.log(res)}
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
