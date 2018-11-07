import genericObjectDetails from '../../app/reducers/genericObjectDetails';
import { SET_TAB, SAVE_PROPS } from '../../app/actions/genericObjectDetails';

describe('reducers', () => {
  describe('genericObjectDetails', () => {
    it('should handle initial state', () => {
      expect(genericObjectDetails(undefined, {})).toEqual({
        activeTab: 'overview'
      });
    });

    it('should set the selected tab', () => {
      const initialState = {
        activeTab: 'overview'
      };
      const action = {
        type: SET_TAB,
        payload: 'layout'
      };
      const expectedState = {
        activeTab: 'layout'
      };
      expect(genericObjectDetails(initialState, action)).toEqual(expectedState);
    });

    it('should set the selected tab to overview given null payload', () => {
      const initialState = {
        activeTab: 'something'
      };
      const action = {
        type: SET_TAB,
        payload: null
      };
      const expectedState = {
        activeTab: 'overview'
      };
      expect(genericObjectDetails(initialState, action)).toEqual(expectedState);
    });

    it('should set the current save props', () => {
      const initialState = {
        activeTab: 'something',
        currProps: {}
      };

      const action = {
        type: SAVE_PROPS,
        payload: { qType: 'test' }
      };

      const expectedState = {
        activeTab: 'something',
        currProps: { qType: 'test' }
      };

      expect(genericObjectDetails(initialState, action)).toEqual(expectedState);
    });
  });
});
