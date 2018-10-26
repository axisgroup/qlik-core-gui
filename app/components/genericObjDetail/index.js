// @flow
import React from 'react';
import { map } from 'rxjs/Operators';
import Toggles from 'arc-design/components/toggles';

import { componentFromStream } from '../../utils/observable-config';
import GenericObjectProperties from './genericObjProperties';
import GenericObjectLayout from './genericObjLayout';

import './genericObjDetail.css';

const GenericObjectDetail = componentFromStream(props$ =>
  props$.pipe(
    map(({ objProps, objLayout, detailState, onSetTab }) => {
      const options = [
        { text: 'Properties Overview', value: 'overview' },
        { text: 'Layout', value: 'layout' },
        { text: 'JSON View', value: 'json' }
      ];
      const onClick = result => {
        onSetTab(result);
      };
      return (
        <div className="container">
          <Toggles
            options={options}
            selectedValueProp={detailState.activeTab}
            onClick={onClick}
          />
          {detailState.activeTab === 'overview' ? (
            <GenericObjectProperties objProps={objProps} />
          ) : null}
          {detailState.activeTab === 'layout' ? (
            <GenericObjectLayout objLayout={objLayout} />
          ) : null}
        </div>
      );
    })
  )
);

export default GenericObjectDetail;
