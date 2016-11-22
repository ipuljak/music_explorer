import React, {Component} from 'react';
import {connect} from 'react-redux';

class Tracks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            currentTrack: null
        };
    }

    pause() {
        if (this.state.playing) {
            this.setState({playing: false});
            this.state.currentTrack.pause();
        }
    }

    playTrack(song) {
        var audio = new Audio(song);
        audio.play()
        this.pause();
        this.setState({
            playing: true,
            currentTrack: audio
        });
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
            <ol>
                {this.renderTracks()}
            </ol>
        );
    }
}

function mapStateToProps(state) {
    return {
        tracks: state.artist.tracks
    }
}

export default connect(mapStateToProps, null)(Tracks);