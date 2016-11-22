import React, {Component} from 'react';
import {connect} from 'react-redux';
import Tracks from './tracks';

class Display extends Component {
    renderArtist() {
        if (this.props.artist) {
            return (
                <h2>{this.props.artist.name}</h2>
            );
        }
    }

    renderInfo() {
        if (this.props.info) {
            const bio = this.props.info.bio.summary.replace(/ <a.*a>/g, "") + '..';
            return (
                <div className="">
                    {bio}
                    <p>Read more <a target="_blank" href={this.props.info.url+'/+wiki'}>here</a>.</p>
                    <img src={this.props.info.image[2]['#text']} />
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderArtist()}
                <Tracks />
                {this.renderInfo()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        artist: state.artist.data,
        similar: state.artist.similar,
        info: state.artist.info
    }
}

export default connect(mapStateToProps, null)(Display);