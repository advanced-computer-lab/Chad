import React, { Component } from 'react';
import './App.css';
import FlightSearch from './components/FlightSearch';
import {stringify} from 'query-string';
import mockFetch from './mock-fetch';



class App extends Component {
  constructor(props) {
      super(props);


  }


  render() {
    return (
      <div className="App">
       
        <div className="App-content">
          <FlightSearch />
          
        </div>
      </div>
    );
  }
}

export default App;
