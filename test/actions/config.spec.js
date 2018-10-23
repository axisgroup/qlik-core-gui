import * as actions from '../../app/actions/config';

describe('actions', () => {
  it('should create a set config action', () => {
    const config = { host: 'localhost', port: 9076, appname: 'drugcases.qvf' };
    expect(actions.setConfig(config)).toEqual({
      type: actions.SET_CONFIG,
      payload: config
    });
  });

  it('should create a set config action with no port and an isSecure property if given no port', () => {
    const config = { host: 'localhost', appname: 'drugcases.qvf' };
    expect(actions.setConfig(config)).toEqual({
      type: actions.SET_CONFIG,
      payload: { host: 'localhost', appname: 'drugcases.qvf', isSecure: true }
    });
  });

  it('should create a remove config action', () => {
    expect(actions.removeConfig()).toEqual({
      type: actions.REMOVE_CONFIG,
      payload: {}
    });
  });
});
