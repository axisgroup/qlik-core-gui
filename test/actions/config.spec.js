import { spy } from 'sinon';
import * as actions from '../../app/actions/config';

describe('actions', () => {
  it('should create a set config action', () => {
    const config = {host: 'localhost', port: 9076, appname: 'drugcases.qvf'};
    expect(actions.setConfig(config)).toEqual({type: actions.SET_CONFIG, payload: config });
  });

  it('should create a remove config action', () => {
    expect(actions.removeConfig()).toEqual({type: actions.REMOVE_CONFIG, payload: {}}); 
  });

});
