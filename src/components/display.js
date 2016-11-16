import React, {Component} from 'react';
import {connect} from 'react-redux';
import {searchArtist} from '../actions';
import {bindActionCreators} from 'redux';

class Display extends Component {
    artistClick(artist) {
        console.log(artist)
    }

    renderArtist() {
        if (!this.props.artist) {
            return (
                <div>Search for an artist to get started!</div>
            );
        } else {
            return (
                <h2>{this.props.artist.name}</h2>
            );
        }
    }

    renderSimilar() {
        if(this.props.similar) {
            //onClick={this.props.searchArtist(item.name)}
            return this.props.similar.map((item) => {
                return (
                    <li key={item.id}
                        onClick={() => this.props.searchArtist(item.name)}>
                        {item.name}
                    </li>
                );
            });
        }
    }

    render() {
        return (
            <div>
                {this.renderArtist()}
                <ul>
                    {this.renderSimilar()}
                </ul>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        artist: state.artist.data,
        similar: state.artist.similar
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({searchArtist}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Display);