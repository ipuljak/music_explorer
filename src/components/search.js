import React, {Component} from 'react';
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
            <div>
                <form onSubmit={this.onSubmit}>
                    <input 
                        className="form-control" 
                        type="text" 
                        placeholder="Search for artist to get started..." 
                        onChange={this.handleOnChange} 
                        value={this.state.term} />
                    <button className="btn btn-primary">Search</button>
                </form>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({searchArtist}, dispatch);
}

export default connect(null, mapDispatchToProps)(Search);