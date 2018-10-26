// @flow
import React from 'react';
import { map } from 'rxjs/Operators';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { componentFromStream } from '../../../utils/observable-config';

import './genericObjLayout.css';

const GenericObjectLayout = componentFromStream(props$ => {
  // function that returns the display of the object layout
  const displayObjLayout = objLayout => (
    // <pre>{JSON.stringify(objLayout, null, 2)}</pre>
    <JSONInput
      id="unique"
      placeholder={objLayout}
      height="100%"
      width="100%"
      locale={locale}
      theme="light_mitsuketa_tribute"
      confirmGood={false}
      onChange={res => console.log(res)}
    />
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
