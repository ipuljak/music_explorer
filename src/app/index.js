import React, { Component } from 'react';

import Header from '../components/header';
import Search from '../components/search';
import Display from '../components/display';

/**
 *  Main app component
 */
class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Search />
        <Display />
      </div>
    );
  }
}

export default App;
