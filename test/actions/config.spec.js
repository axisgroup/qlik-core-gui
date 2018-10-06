import { spy } from 'sinon';
import * as actions from '../../app/actions/config';

describe('actions', () => {
  it('should create a set config action', () => {
    expect(actions.setConfig({host: 'localhost', port: 9076, appname: 'drugcases.qvf'})).toMatchSnapshot();
  });

  it('should create a remove config action', () => {
    expect(actions.removeConfig()).toMatchSnapshot(); 
  });

  // it('should decrement should create decrement action', () => {
  //   expect(actions.decrement()).toMatchSnapshot();
  // });

  // it('should incrementIfOdd should create increment action', () => {
  //   const fn = actions.incrementIfOdd();
  //   expect(fn).toBeInstanceOf(Function);
  //   const dispatch = spy();
  //   const getState = () => ({ counter: 1 });
  //   fn(dispatch, getState);
  //   expect(dispatch.calledWith({ type: actions.INCREMENT_COUNTER })).toBe(true);
  // });

  // it('should incrementIfOdd shouldnt create increment action if counter is even', () => {
  //   const fn = actions.incrementIfOdd();
  //   const dispatch = spy();
  //   const getState = () => ({ counter: 2 });
  //   fn(dispatch, getState);
  //   expect(dispatch.called).toBe(false);
  // });

  // // There's no nice way to test this at the moment...
  // it('should incrementAsync', done => {
  //   const fn = actions.incrementAsync(1);
  //   expect(fn).toBeInstanceOf(Function);
  //   const dispatch = spy();
  //   fn(dispatch);
  //   setTimeout(() => {
  //     expect(dispatch.calledWith({ type: actions.INCREMENT_COUNTER })).toBe(
  //       true
  //     );
  //     done();
  //   }, 5);
  // });
});
