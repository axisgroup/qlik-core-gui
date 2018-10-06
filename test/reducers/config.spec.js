import config from '../../app/reducers/config';
import { SET_CONFIG, REMOVE_CONFIG } from '../../app/actions/config';

describe('reducers', () => {
  describe('config', () => {
    it('should handle initial state', () => {
      expect(config(undefined, {})).toEqual({});
    });

    it('should handle SET_CONFIG with given config', () => {
      expect(
        config(
          {},
          {
            type: SET_CONFIG,
            payload: {
              host: 'localhost',
              port: 9076,
              appname: 'drugcases.qvf'
            }
          }
        )
      ).toEqual({
        host: 'localhost',
        port: 9076,
        appname: 'drugcases.qvf'
      });
    });

    it('should handle SET_CONFIG with no config', () => {
      expect(
        config(
          {},
          {
            type: SET_CONFIG
          }
        )
      ).toEqual({});
    });

    it('should handle REMOVE_CONFIG with a given config', () => {
      expect(
        config(
          {
            host: 'localhost',
            port: 9076,
            appname: 'drugcases.qvf'
          },
          {
            type: REMOVE_CONFIG,
            payload: {
              host: 'localhost',
              port: 9076,
              appname: 'drugcases.qvf'
            }
          }
        )
      ).toEqual({});
    });

    it('should handle REMOVE_CONFIG with no given config', () => {
      expect(
        config(
          {
            host: 'localhost',
            port: 9076,
            appname: 'drugcases.qvf'
          },
          { type: REMOVE_CONFIG }
        )
      ).toEqual({});
    });

    it('should handle unknown action type', () => {
      expect(
        config(
          {
            host: 'localhost',
            port: 9076,
            appname: 'drugcases.qvf'
          },
          { type: 'unknown' }
        )
      ).toEqual({
        host: 'localhost',
        port: 9076,
        appname: 'drugcases.qvf'
      });
    });
  });
});
