// @flow
import React, { Component } from 'react';
import Layout from 'arc-design/components/layout';
import './Home.css';
import NavBar from './navbar';
import QaeContext from '../data-provider/qae-context';
import Docker from 'dockerode';

const docker1 = new Docker();

type Props = {};
const qDef = {
  qInfo: {
    qType: 'obj'
  },
  metric: {
    qValueExpression: '=sum(1+1)'
  }
};
export default class Home extends Component<Props> {
  props: Props;

  render() {
    const docker = new Docker();
    docker.listContainers(function(err, containers) {
      console.log(containers);
    });
    return (
      <div className="home">
        <Layout>
          <Layout.PrimaryHeader>
            <NavBar />
          </Layout.PrimaryHeader>
          <Layout.Sidebar> sidebar </Layout.Sidebar>
          main content
          {/* <QaeContext.QaeConsumer> 
            {(qaeService) => {
              console.log(qaeService);
              return null;
            }}
          </QaeContext.QaeConsumer> */}
          <QaeContext.GenericObject qDef={qDef} syncQProps={true}>
            {value => {
              console.log(value);
              return null;
            }}
          </QaeContext.GenericObject>
        </Layout>
      </div>
    );
  }
}
