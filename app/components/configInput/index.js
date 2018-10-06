// @flow
import React from 'react';
import './configInput.css';
import type { Config } from '../../reducers/types';

type Props = {
  setConfig: (config: Config) => void,
  removeConfig: () => void,
  config: Config
};

const ConfigInput = (props: Props) => {
  const { setConfig, removeConfig, config } = props;
  let host: string;
  let port: number;
  let appname: string;
  return (
    <form
      onSubmit={() => setConfig({ host: host, port: port, appname: appname })}
    >
      <label>
        Host:
      </label>
        <input
          value={host}
          type="text"
          onChange={event => (host = event.target.value)}
        />
      <div class="spacer" />
      <label>
        Port:
      </label>
        <input
          value={port}
          type="number"
          onChange={event => (port = parseInt(event.target.value))}
        />
      <div class="spacer" />
      <label>
        App Name:
      </label>
        <input
          value={appname}
          type="text"
          onChange={event => (appname = event.target.value)}
        />
      <div class="spacer" />
      <input type="submit" value="Connect" />
    </form>
  );
};

export default ConfigInput;
