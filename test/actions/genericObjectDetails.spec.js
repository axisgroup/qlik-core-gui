import * as actions from '../../app/actions/genericObjectDetails';

describe('actions', () => {
  it('should create a set tab action', () => {
    expect(actions.setTab('overview')).toEqual({
      type: actions.SET_TAB,
      payload: 'overview'
    });
  });

  it('should create a set tab action with null payload if input is not valid', () => {
    expect(actions.setTab(1)).toEqual({
      type: actions.SET_TAB,
      payload: null
    });
  });
});
