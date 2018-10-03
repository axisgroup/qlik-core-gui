/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import QaeContext from './data-provider/qae-context';

export default () => (
  <App>
    <QaeContext.QaeProvider value={QaeContext.QaeService}>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </QaeContext.QaeProvider>
  </App>
);
