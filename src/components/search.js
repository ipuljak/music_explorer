import React, {Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import {connect} from 'react-redux';
import {searchArtist} from '../actions';
import {bindActionCreators} from 'redux';
import testing from '../data_visualization/tree';

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {term: ''};
        this.onSubmit = this.onSubmit.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentDidMount() {
        findDOMNode(this.refs.searchInput).focus(); 
    }

    onSubmit(event) {
        // Prevent the form from submitting
        event.preventDefault();

        // Search for artist action
        this.props.searchArtist(this.state.term);

        // Reset the search bar
        this.setState({term: ''});

        //createTree("some kind of monster");
    }

    handleOnChange(event) {
        this.setState({term: event.target.value});
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({searchArtist}, dispatch);
}

export default connect(null, mapDispatchToProps)(Search);