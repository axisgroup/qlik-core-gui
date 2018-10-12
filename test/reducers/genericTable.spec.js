import genericTable from '../../app/reducers/genericTable';
import {
  TOGGLE_ROW,
  TOGGLE_EXPAND_ALL,
  SELECT_OBJ
} from '../../app/actions/genericTable';

describe('reducers', () => {
  describe('genericTable', () => {
    it('should handle initial state', () => {
      expect(genericTable(undefined, {})).toEqual({
        expandedRows: [],
        selectedObj: '',
        expandAll: false
      });
    });

    it('should handle TOGGLE_ROW by adding given name to array', () => {
      expect(
        genericTable(
          { expandedRows: ['test', 'test2'] },
          {
            type: TOGGLE_ROW,
            payload: 'test3'
          }
        )
      ).toEqual({
        expandedRows: ['test', 'test2', 'test3'],
        expandAll: false
      });
    });

    it('should handle TOGGLE_ROW by taking away given name in array', () => {
      expect(
        genericTable(
          {
            expandedRows: ['test', 'test2'],
            expandAll: false
          },
          {
            type: TOGGLE_ROW,
            payload: 'test2'
          }
        )
      ).toEqual({
        expandedRows: ['test'],
        expandAll: false
      });
    });

    it('should handle TOGGLE_ROW with undefined state by adding given name to array', () => {
      expect(
        genericTable(undefined, {
          type: TOGGLE_ROW,
          payload: 'test3'
        })
      ).toEqual({
        expandedRows: ['test3'],
        selectedObj: '',
        expandAll: false
      });
    });

    it('should handle TOGGLE_ROW by changing expand all to false', () => {
      expect(
        genericTable(
          {
            expandedRows: ['test', 'test2'],
            expandAll: true
          },
          {
            type: TOGGLE_ROW,
            payload: 'test3'
          }
        )
      ).toEqual({
        expandedRows: ['test', 'test2', 'test3'],
        expandAll: false
      });
    });

    it('should handle TOGGLE_EXPAND_ALL by changing the expand all option from false to true', () => {
      expect(
        genericTable(
          { expandedRows: ['test1'], selectedObj: 'xyz', expandAll: false },
          {
            type: TOGGLE_EXPAND_ALL,
            payload: null
          }
        )
      ).toEqual({
        expandedRows: ['test1'],
        selectedObj: 'xyz',
        expandAll: true
      });
    });

    it('should handle TOGGLE_EXPAND_ALL by changing the expand all option from true to false and wipe the expanded rows', () => {
      expect(
        genericTable(
          { expandedRows: ['test1'], selectedObj: 'xyz', expandAll: true },
          {
            type: TOGGLE_EXPAND_ALL,
            payload: null
          }
        )
      ).toEqual({
        expandedRows: [],
        selectedObj: 'xyz',
        expandAll: false
      });
    });

    it('should handle SELECT_OBJ by setting the selected object property', () => {
      expect(
        genericTable(
          { expandedRows: ['test1'], selectedObj: 'xyz' },
          {
            type: SELECT_OBJ,
            payload: 'test'
          }
        )
      ).toEqual({
        expandedRows: ['test1'],
        selectedObj: 'test'
      });
    });

    it('should handle SELECT_OBJ by setting the selected object property to empty string if non-text input', () => {
      expect(
        genericTable(
          { expandedRows: ['test1'], selectedObj: 'xyz' },
          {
            type: SELECT_OBJ,
            payload: 123
          }
        )
      ).toEqual({
        expandedRows: ['test1'],
        selectedObj: ''
      });
    });

    it('should handle SELECT_OBJ by setting the selected object property to empty string if null input', () => {
      expect(
        genericTable(
          { expandedRows: ['test1'], selectedObj: 'xyz' },
          {
            type: SELECT_OBJ,
            payload: null
          }
        )
      ).toEqual({
        expandedRows: ['test1'],
        selectedObj: ''
      });
    });
  });
});
