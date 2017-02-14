import React, { Component } from 'react';
import { connect } from 'react-redux';

/**
 *  Tracks class container
 *    -> Fetches and displays a list of playable tracks 
 */
class Tracks extends Component {
  constructor(props) {
    super(props);
    // The initial state does not have a track and is not playing anything
    this.state = {
      playing: false,
      currentTrack: null
    };
  }

  // Pause the current track that is playing
  pause() {
    const { currentTrack, playing } = this.state;
    if (playing) {
      this.setState({ playing: false });
      currentTrack.pause();
    }
  }

  // Play the requested song
  playTrack(song) {
    var audio = new Audio(song);
    audio.play()
    this.pause();
    this.setState({
      playing: true,
      currentTrack: audio
    });
  }

  // Render all of the track titles
  renderTracks() {
    const { tracks } = this.props;
    if (tracks) {
      return tracks.map((item) => {
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
      <ul className="infoTracks">
        {this.renderTracks()}
      </ul>
    );
  }
}

const mapStateToProps = state => {
  return {
    tracks: state.artist.tracks
  }
};

export default connect(mapStateToProps, null)(Tracks);