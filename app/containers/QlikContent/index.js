// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import connectQlik from 'react-qae';

import GenericObjectView from '../../components/genericObjView';
import * as ConfigActions from '../../actions/config';
import type { Config } from '../../reducers/types';

import './qlikcontent.css';

/* eslint-disable react/no-unused-prop-types */
type Props = {
  config: Config,
  removeConfig: () => void
};
/* eslint-enable react/no-unused-prop-types */

function mapStateToProps(state) {
  return {
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ConfigActions, dispatch);
}

const QlikContent = (props: Props) => {
  /* eslint-disable no-unused-vars */
  const { removeConfig, config } = props;
  /* eslint-enable no-unused-vars */

  // DELETE THIS LATER
  const configTemp = {
    host: 'localhost',
    port: 9076,
    appname: 'AUM and Flows_Scramble_ExpDeOpt.qvf'
  };
  let QaeContext;
  if (configTemp.host && configTemp.appname && configTemp.port) {
    QaeContext = connectQlik(configTemp);
    return (
      <div className="main-qlik">
        <QaeContext.QaeProvider value={QaeContext.QaeService}>
          <GenericObjectView doc$={QaeContext.QaeService.doc$} />
        </QaeContext.QaeProvider>
      </div>
    );
  }
  // END DELETE THIS
  // let QaeContext;
  // if (config.host && config.appname && config.port) {
  //   QaeContext = connectQlik(config);
  //   return (
  //     <div className="main-qlik">
  //       <QaeContext.QaeProvider value={QaeContext.QaeService}>
  //         <GenericObjectView doc$={QaeContext.QaeService.doc$} />
  //       </QaeContext.QaeProvider>
  //     </div>
  //   );
  // }
  return null;
};

// $FlowFixMe
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QlikContent);
