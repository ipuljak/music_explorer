import React, {Component} from 'react';
import {connect} from 'react-redux';

class Display extends Component {
    // Play the requested song
    playTrack(song) {
        var audio = new Audio(song);
        audio.play()
    }

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

    renderTracks() {
        if (this.props.tracks) {
            return this.props.tracks.map((item) => {
                return (
                    <li key={item.id} onClick={() => this.playTrack(item.preview_url)}>
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
                <ol>
                    {this.renderTracks()}
                </ol>
                {this.renderInfo()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        artist: state.artist.data,
        similar: state.artist.similar,
        info: state.artist.info,
        tracks: state.artist.tracks
    }
}

export default connect(mapStateToProps, null)(Display);