import React, { Component } from 'react';
import Search from './search';
import Display from './display';

export default class App extends Component {
  render() {
    return (
        <div className="container">
            <Search />
            <Display />
        </div>
    );
  }
}
