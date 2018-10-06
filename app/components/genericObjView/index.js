// @flow
import React from 'react';
import Layout from 'arc-design/components/layout';
import './genericObjView.css';
import NavBar from '../navbar';
import connectQlik from 'react-qae';

const config = {
  host: 'localhost',
  port: 9076,
  appname: 'drugcases.qvf'
};

const QaeContext = connectQlik(config);

const qDef = {
  qInfo: {
    qType: 'measure'
  },
  qExpressionValue: '=sum(1+1)'
};

const GenericObjectView = () => {
  return (
    <div className="genericObjView">
      <Layout>
        <Layout.PrimaryHeader>
          <NavBar />
        </Layout.PrimaryHeader>
        <Layout.Sidebar> </Layout.Sidebar>
        <QaeContext.QaeProvider value={QaeContext.QaeService}>
          <QaeContext.QaeConsumer>
            {qaeService => {
              console.log(qaeService);
              return null;
            }}
          </QaeContext.QaeConsumer>
          <QaeContext.GenericObject qDef={qDef} syncQProps={true}>
            {value => {
              console.log(value);
              return null;
            }}
          </QaeContext.GenericObject>
        </QaeContext.QaeProvider>
      </Layout>
    </div>
  );
};

export default GenericObjectView;
// export default class Home extends Component<Props> {

//   state: {config: Config};

//   constructor(props: Props) {
//     super(props);

//     this.state = {
//       config: {
//         host: 'localhost',
//         port: 9076,
//         appname: 'drugcases.qvf'
//       }
//     };
//   }

//   update() {

//   }

//   render() {
//     const docker = new Docker();
//     docker.listContainers(function(err, containers) {
//       console.log(containers);
//     });

//     const QaeContext = connectQlik(this.state.config);
//     return (
//       <div className="home">
//         <Layout>
//           <Layout.PrimaryHeader>
//             <NavBar />
//           </Layout.PrimaryHeader>
//           <Layout.Sidebar>  </Layout.Sidebar>
//           {/* <QaeContext.QaeConsumer>
//             {(qaeService) => {
//               console.log(qaeService);
//               return null;
//             }}
//           </QaeContext.QaeConsumer> */}
//           {/* <QaeContext.GenericObject qDef={qDef} syncQProps={true}>
//             {value => {
//               console.log(value);
//               return null;
//             }}
//           </QaeContext.GenericObject> */}
//         </Layout>
//       </div>
//     );
//   }
// }
