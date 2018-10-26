// @flow
import React from 'react';
import { map } from 'rxjs/Operators';
import Toggles from 'arc-design/components/toggles';
import Tile from 'arc-design/components/tile';

import { componentFromStream } from '../../utils/observable-config';
import GenericObjectProperties from './genericObjProperties';
import GenericObjectLayout from './genericObjLayout';
import GenericObjectPropEditor from './genericObjPropEditor';

import './genericObjDetail.css';

const GenericObjectDetail = componentFromStream(props$ =>
  props$.pipe(
    map(({ objProps, objLayout, detailState, onSetTab }) => {
      const options = [
        { text: 'Overview', value: 'overview' },
        { text: 'Properties Editor', value: 'json' },
        { text: 'Layout Viewer', value: 'layout' }
      ];
      const onClick = result => {
        onSetTab(result);
      };
      return (
        <div className="genObjDetailContainer">
          <Toggles
            options={options}
            selectedValueProp={detailState.activeTab}
            onClick={onClick}
          />
          <div className="tileWrapper">
            <Tile>
              {detailState.activeTab === 'overview' ? (
                <GenericObjectProperties objProps={objProps} />
              ) : null}

              {detailState.activeTab === 'layout' ? (
                <GenericObjectLayout objLayout={objLayout} />
              ) : null}

              {detailState.activeTab === 'json' ? (
                <GenericObjectPropEditor objProps={objProps} />
              ) : null}
            </Tile>
          </div>
        </div>
      );
    })
  )
);

export default GenericObjectDetail;
