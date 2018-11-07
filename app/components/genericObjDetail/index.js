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
      const objPropsOnly = objProps;
      if (objPropsOnly) delete objPropsOnly.qChildren;
      const onClick = result => {
        onSetTab(result);
      };
      let tileTitle = '';
      switch (detailState.activeTab) {
        case 'overview':
          tileTitle = 'OBJECT INSPECTOR';
          break;

        case 'layout':
          tileTitle = 'LAYOUT VIEWER';
          break;

        case 'json':
          tileTitle = 'PROPERTIES EDITOR';
          break;

        default:
          tileTitle = 'ERROR';
      }

      return (
        <div className="genObjDetailContainer">
          <div className="toggles">
            <Toggles
              options={options}
              selectedValueProp={detailState.activeTab}
              onClick={onClick}
            />
          </div>
          <div className="tileWrapper">
            <Tile tileTitle={tileTitle}>
              {detailState.activeTab === 'overview' ? (
                <GenericObjectProperties objProps={objProps} />
              ) : null}

              {detailState.activeTab === 'layout' ? (
                <GenericObjectLayout objLayout={objLayout} />
              ) : null}

              {detailState.activeTab === 'json' ? (
                <GenericObjectPropEditor objProps={objPropsOnly} />
              ) : null}
            </Tile>
          </div>
        </div>
      );
    })
  )
);

export default GenericObjectDetail;
