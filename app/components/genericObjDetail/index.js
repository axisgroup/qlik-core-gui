// @flow
import React from 'react';
import { map, filter } from 'rxjs/Operators';
import { componentFromStream } from '../../utils/observable-config';

import './genericObjDetail.css';

const GenericObjectDetail = componentFromStream(props$ => {
  // function that returns a row with property name and value
  const tableRow = (name, value) => (
    <tr key={name}>
      <td>{name}</td>
      <td>{value}</td>
    </tr>
  );

  const displayObjMeta = qProperty => (
    <div className="propsSection">
      <table className="objPropTable">
        <tbody>
          {tableRow(
            'Title',
            qProperty.title ? qProperty.title : qProperty.qMetaDef.title
          )}
          {qProperty.qMetaDef.description
            ? tableRow('Description', qProperty.qMetaDef.description)
            : null}
          {tableRow('qId', qProperty.qInfo.qId)}
          {tableRow('qType', qProperty.qInfo.qType)}
        </tbody>
      </table>
    </div>
  );

  const displayObjHyperCubeDef = qHyperCubeDef => (
    <div className="propsSection">
      HyperCubeDef
      <table className="objPropTable">
        <tbody>
          {qHyperCubeDef.qDimensions.map(dim =>
            tableRow('Dimensions', dim.qLibraryId)
          )}
        </tbody>
      </table>
    </div>
  );

  // function that returns the display of the object properties
  const displayObjProps = objProps => {
    const { qProperty, qChildren } = objProps;
    console.log(qProperty, qChildren);
    return (
      <React.Fragment>
        {displayObjMeta(qProperty)}
        {qProperty.qHyperCubeDef
          ? displayObjHyperCubeDef(qProperty.qHyperCubeDef)
          : null}
      </React.Fragment>
    );
  };

  return props$.pipe(
    filter(({ objProps, objLayout }) => objProps && objLayout),
    map(({ objProps, objLayout }) => {
      console.log(objLayout);
      const content = displayObjProps(objProps);
      return (
        <div className="container">
          <div className="properties" />
          {content}
        </div>
      );
    })
  );
});

export default GenericObjectDetail;
