import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap'
import './App.css';
import Search from './components/Search'
import Airports from './components/Airports'
import Stats from './components/Stats'


export default class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    return (
      <div className="App">
        <div className="shadow"></div>
        <header className="App-content">
          <Tabs defaultActiveKey="search">
            <Tab eventKey="search" title="Search">
              <Search />
            </Tab>
            <Tab eventKey="airports" title="Airports">
              <Airports />
            </Tab>
            <Tab eventKey="stats" title="Stats">
              <Stats />
            </Tab>
          </Tabs>
        </header>
      </div>
    );
  }
}
