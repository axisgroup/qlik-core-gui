// // @flow
// import React from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import connectQlik from 'react-qae';

// import type { Config } from '../reducers/types';

// type Props = {
//   config: Config
// };

// function mapStateToProps(state) {
//   return {
//     config: state.config
//   };
// }

// const QaeContext = null;

// const createQlikContext = (props: Props) => {
//   /* eslint-disable no-unused-vars */
//   const { config } = props;
//   /* eslint-enable no-unused-vars */

//   if (config.host && config.appname && config.port) {
//     QaeContext = connectQlik(config);
//   }
// };

// export {QaeContext};
// export {createQlikContext};
