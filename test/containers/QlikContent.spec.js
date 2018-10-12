import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'react-router-redux';
import QlikContent from '../../app/containers/QlikContent';
import { configureStore } from '../../app/store/configureStore';
import type { Config } from '../../app/reducers/types';

Enzyme.configure({ adapter: new Adapter() });

function setup(initialState) {
  const store = configureStore(initialState);
  const history = createBrowserHistory();
  const provider = (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <QlikContent />
      </ConnectedRouter>
    </Provider>
  );
  const app = mount(provider);
  return {
    app,
    maincontent: app.find('div.main-qlik')
  };
}

describe('containers', () => {
  describe('QlikContent', () => {
    // it('should not render given an empty config', () => {
    //   const { maincontent } = setup({});
    //   expect(maincontent.exists()).toEqual(false);
    // });

    it('should render given a config', () => {
      const { maincontent } = setup({config: {host: 'localhost', port: '9076', appname: 'drugcases.qvf'}});
      expect(maincontent).toBeDefined();
    });

    
  });
});
