// @flow
import React from 'react';
import Layout from 'arc-design/components/layout';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NavBar from '../../components/navbar';
/* eslint-disable no-unused-vars */
import ConfigInput from '../../components/configInput';
/* eslint-enable no-unused-vars */
import QlikContent from '../QlikContent';

import * as ConfigActions from '../../actions/config';
import type { Config } from '../../reducers/types';

import './homepage.css';

type Props = {
  config: Config,
  setConfig: (config: Config) => void,
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

const HomePage = (props: Props) => {
  /* eslint-disable no-unused-vars */
  const { setConfig, removeConfig, config } = props;
  /* eslint-enable no-unused-vars */

  const content = <QlikContent />;
  // config.host && config.appname && config.port ? (
  //   <QlikContent />
  // ) : (
  //   <ConfigInput onSubmit={setConfig} />
  // );

  return (
    <div className="homeView">
      <Layout>
        <Layout.PrimaryHeader>
          <NavBar />
        </Layout.PrimaryHeader>
        {/* <Layout.Sidebar /> */}
        {content}
      </Layout>
    </div>
  );
};

// $FlowFixMe
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
