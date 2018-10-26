// @flow
import React from 'react';
import { map } from 'rxjs/Operators';
import Table from 'arc-design/components/table';
import { componentFromStream } from '../../../utils/observable-config';
import './genericObjProperties.css';

const GenericObjectProperties = componentFromStream(props$ => {
  const displayObjMeta = qProperty => {
    const columns = [
      {
        key: 'name',
        title: 'Property Name',
        dataIndex: 'name',
        alignment: 'left'
      },
      {
        key: 'value',
        title: 'Property Value',
        dataIndex: 'value',
        alignment: 'left'
      }
    ];

    const metaData = [
      {
        key: '1',
        name: 'Title',
        value: qProperty.title ? qProperty.title : qProperty.qMetaDef.title
      },
      {
        key: '3',
        name: 'qId',
        value: qProperty.qInfo.qId
      },
      {
        key: '4',
        name: 'qType',
        value: qProperty.qInfo.qType
      }
    ];

    if (qProperty.qMetaDef.description) {
      metaData.push({
        key: '2',
        name: 'qId',
        value: qProperty.qMetaDef.description
      });
    }
    return <Table data={metaData} columns={columns} />;
  };

  const displayDimDef = qDimensions => {
    const columns = [
      {
        key: 'libId',
        title: 'Library ID',
        dataIndex: 'libId',
        alignment: 'left'
      },
      {
        key: 'qDef',
        title: 'Definitions',
        dataIndex: 'qDef',
        alignment: 'left'
      }
    ];

    const dimensionData = qDimensions.map((dim, i) => ({
      key: i,
      libId: dim.qLibraryId ? dim.qLibraryId : '',
      qDef: dim.qDef.qFieldDefs ? dim.qDef.qFieldDefs.join(', ') : ''
    }));

    return (
      <div className="objPropTableTitle">
        <div>Dimensions</div>
        <Table data={dimensionData} columns={columns} />
      </div>
    );
  };

  const displayMeasureDef = qMeasures => {
    const columns = [
      {
        key: 'libId',
        title: 'Library ID',
        dataIndex: 'libId',
        alignment: 'left'
      },
      {
        key: 'qDef',
        title: 'Definitions',
        dataIndex: 'qDef',
        alignment: 'left'
      }
    ];

    const measureData = qMeasures.map((measure, i) => ({
      key: i,
      libId: measure.qLibraryId ? measure.qLibraryId : '',
      qDef: measure.qDef.qDef ? measure.qDef.qDef : ''
    }));

    return (
      <div className="objPropTableTitle">
        <div>Measures</div>
        <Table data={measureData} columns={columns} />
      </div>
    );
  };

  // function that returns the display of the object properties
  const displayObjProps = objProps => {
    const { qProperty } = objProps;

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
    map(({ objProps }) => {
      const content = objProps
        ? displayObjProps(objProps)
        : 'No Object Selected';
      return <div className="genericObjProperties">{content}</div>;
    })
  );
});

export default GenericObjectProperties;
