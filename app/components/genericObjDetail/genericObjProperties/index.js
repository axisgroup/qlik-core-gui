// @flow
import React from 'react';
import { map } from 'rxjs/Operators';
import { componentFromStream } from '../../../utils/observable-config';

import './genericObjProperties.css';

const GenericObjectProperties = componentFromStream(props$ => {
  // function that returns a row with property name and value
  const tableRow = (name, value, key) => (
    <tr key={key}>
      <td>{name}</td>
      <td>{value}</td>
    </tr>
  );

  const displayObjMeta = qProperty => (
    <div className="propsSection">
      <table className="objPropTable">
        <thead>
          <tr>
            <td>Property Name</td>
            <td>Property Value</td>
          </tr>
        </thead>
        <tbody>
          {tableRow(
            'Title',
            qProperty.title ? qProperty.title : qProperty.qMetaDef.title,
            1
          )}
          {qProperty.qMetaDef.description
            ? tableRow('Description', qProperty.qMetaDef.description, 2)
            : null}
          {tableRow('qId', qProperty.qInfo.qId, 3)}
          {tableRow('qType', qProperty.qInfo.qType, 4)}
        </tbody>
      </table>
    </div>
  );

  const displayDimDef = qDimensions => (
    <div className="propSection">
      Dimensions: {` (${qDimensions.length})`}
      <table className="objPropTable">
        <thead>
          <tr>
            <td>Library ID</td>
            <td>Definitions</td>
          </tr>
        </thead>
        <tbody>
          {qDimensions.map(dim =>
            tableRow(
              dim.qLibraryId ? dim.qLibraryId : '',
              dim.qDef.qFieldDefs ? dim.qDef.qFieldDefs.join(', ') : '',
              dim.qLibraryId ? dim.qLibraryId : dim.qDef.qFieldDefs.join(', ')
            )
          )}
        </tbody>
      </table>
    </div>
  );

  const displayMeasureDef = qMeasures => (
    <div className="propSection">
      Measures: {` (${qMeasures.length})`}
      <table className="objPropTable">
        <thead>
          <tr>
            <td>Library ID</td>
            <td>Definitions</td>
          </tr>
        </thead>
        <tbody>
          {qMeasures.map(measure =>
            tableRow(
              measure.qLibraryId ? measure.qLibraryId : '',
              measure.qDef.qDef ? measure.qDef.qDef : '',
              measure.qLibraryId ? measure.qLibraryId : measure.qDef.qDef
            )
          )}
        </tbody>
      </table>
    </div>
  );

  // function that returns the display of the object properties
  const displayObjProps = objProps => {
    const { qProperty, qChildren } = objProps;
    console.log(qChildren);
    return (
      <React.Fragment>
        {displayObjMeta(qProperty)}
        {qProperty.qHyperCubeDef
          ? displayDimDef(qProperty.qHyperCubeDef.qDimensions)
          : null}
        {qProperty.qHyperCubeDef
          ? displayMeasureDef(qProperty.qHyperCubeDef.qMeasures)
          : null}
      </React.Fragment>
    );
  };

  return props$.pipe(
    // filter(({ objProps }) => objProps ),
    map(({ objProps }) => {
      const content = objProps
        ? displayObjProps(objProps)
        : 'No Object Selected';
      return <div className="genericObjProperties">{content}</div>;
    })
  );
});

export default GenericObjectProperties;
