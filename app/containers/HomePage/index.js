// @flow
import React, { Component } from 'react';
import GenericObjectView from '../../components/genericObjView';
import Layout from 'arc-design/components/layout';
import NavBar from '../../components/navbar';
import ConfigInputPage from '../configInputPage';


import './homepage.css';

type Props = {};

export default class HomePage extends Component<Props> {

  render() {
    return (
      <div className="homeView">
        <Layout>
          <Layout.PrimaryHeader>
            <NavBar />
          </Layout.PrimaryHeader>
          <Layout.Sidebar> </Layout.Sidebar>
          <ConfigInputPage/>
        </Layout>
      </div>
    );
  }
}
