import { spy } from 'sinon';
import * as actions from '../../app/actions/config';

describe('actions', () => {
  it('should create a set config action', () => {
    expect(actions.setConfig({host: 'localhost', port: 9076, appname: 'drugcases.qvf'})).toMatchSnapshot();
  });

  it('should create a remove config action', () => {
    expect(actions.removeConfig()).toMatchSnapshot(); 
  });

});
