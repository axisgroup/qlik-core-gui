// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './configInput.css';
import type { Config } from '../../reducers/types';

import * as ConfigActions from '../../actions/config';

type Props = {
  onSubmit: (config: Config) => void
};

function mapStateToProps(state) {
  return {
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ConfigActions, dispatch);
}

const ConfigInput = (props: Props) => {
  const { onSubmit } = props;
  let host: string;
  let port: number;
  let appname: string;
  return (
    <form onSubmit={() => onSubmit({ host, port, appname })}>
      <label htmlFor="host">Host: </label>
      <input
        id="host"
        value={host}
        type="text"
        onChange={event => {
          host = event.target.value;
        }}
      />
      <div className="spacer" />
      <label htmlFor="port">Port: </label>
      <input
        id="port"
        value={port}
        type="number"
        onChange={event => {
          port = parseInt(event.target.value, 10);
        }}
      />
      <div className="spacer" />
      <label htmlFor="appname">App Name: </label>
      <input
        id="appname"
        value={appname}
        type="text"
        onChange={event => {
          appname = event.target.value;
        }}
      />
      <div className="spacer" />
      <input type="submit" value="Connect" />
    </form>
  );
};

// export default ConfigInput;

// $FlowFixMe
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigInput);
