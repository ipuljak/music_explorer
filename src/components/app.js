import React, { Component } from 'react';
import Header from './header';
import Search from './search';
import Display from './display';

export default class App extends Component {
  render() {
    return (
        <div>
            <Header />
            <Search />
            <Display />
        </div>
    );
  }
}
