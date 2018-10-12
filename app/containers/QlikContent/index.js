// @flow
import React, { Component } from 'react';
import Layout from 'arc-design/components/layout';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import connectQlik from 'react-qae';
import { switchMap, map } from 'rxjs/operators';
import { GetAllInfos } from 'rxq/Doc';

import GenericObjectView from '../../components/genericObjView';
import * as ConfigActions from '../../actions/config';
import type { Config } from '../../reducers/types';

import './qlikcontent.css';

type Props = {
  config: Config,
  removeConfig: () => void
};

function mapStateToProps(state) {
  return {
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ConfigActions, dispatch);
}

const QlikContent = (props: Props) => {
  const { removeConfig /*, config*/ } = props;
  /*** DELETE THIS LATER ***/
  const config = {
    host: 'localhost',
    port: 9076,
    appname: 'drugcases.qvf'
  };
  /*** END DELETE THIS ***/
  let QaeContext;
  if (config.host && config.appname && config.port) {
    QaeContext = connectQlik(config);
    const genericObjList$ = QaeContext.QaeService.doc$.pipe(
      switchMap(docH => docH.ask(GetAllInfos))
    );
    // QaeContext.QaeService.session.notifications$.subscribe(console.log)
    return (
      <div className="main-qlik">
        <QaeContext.QaeProvider value={QaeContext.QaeService}>
          <GenericObjectView doc$={QaeContext.QaeService.doc$}/>
        </QaeContext.QaeProvider>
      </div>
    );
  } else {
    return null;
  }
};

// $FlowFixMe
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QlikContent);
