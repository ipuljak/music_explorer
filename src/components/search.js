import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { searchArtist } from '../actions';

/**
 *  Search class container
 *    -> Contains all of the logic for searching for an artist
 */
class Search extends Component {
  constructor(props) {
    super(props);
    // The search term is initially blank
    this.state = { term: '' };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  // Focus on the search bar once it mounts
  componentDidMount() {
    findDOMNode(this.refs.searchInput).focus();
  }

  // When a search term is submitted
  onSubmit(event) {
    // Prevent the form submit from reloading the page
    event.preventDefault();
    // Search for artist action
    this.props.searchArtist(this.state.term);
    // Reset the search bar
    this.setState({ term: '' });
  }

  // Update the search bar state for each key press
  handleOnChange(event) {
    this.setState({ term: event.target.value });
  }

  render() {
    return (
      <div className="wrapper">
        <form onSubmit={this.onSubmit}>
          <input
            className="searchBar"
            type="text"
            placeholder="Search for an artist..."
            onChange={this.handleOnChange}
            value={this.state.term}
            ref="searchInput" />
          <button className="btn btn-default searchButton">Search</button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ searchArtist }, dispatch);
};

export default connect(null, mapDispatchToProps)(Search);