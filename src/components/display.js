import React, {Component} from 'react';
import {connect} from 'react-redux';
import ArtistItem from './artist_item';

class Display extends Component {
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
                    <ArtistItem 
                        key={item.name} 
                        item={item}
                    /> 
                );
            });
        }
    }

    render() {
        return (
            <div>
                {this.renderArtist()}
                <hr/>
                <div>
                    {this.renderSimilar()}
                </div>
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

export default connect(mapStateToProps, null)(Display);