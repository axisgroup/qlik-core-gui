import React from 'react';
import { render } from 'react-dom';
// import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';

const store = configureStore();

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
