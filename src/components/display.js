import React, { Component } from 'react';
import { connect } from 'react-redux';

import Tracks from './tracks';

/**
 *  Display class container
 *    -> Displays all of the artist information including name, tracks, bio, and photo
 */
class Display extends Component {
  // Render the artists name
  renderArtist() {
    const { artist } = this.props;

    if (artist) {
      return (
        <h1>{artist.name}</h1>
      );
    }
  }

  // Render the artists information -> includes a bio and photo
  renderInfo() {
    const { info } = this.props;
    if (this.props.info) {
      const bio = info.bio.summary.replace(/ <a.*a>/g, "") + '..';
      return (
        <div className="infoText">
          <p className="floatChild">
            <img className="infoPic" src={info.image[2]['#text']} />
          </p>
          <p>
            {bio}Read more <a target="_blank" href={info.url + '/+wiki'}>here</a>.
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="infoBio">
        {this.renderArtist()}
        <Tracks />
        {this.renderInfo()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    artist: state.artist.data,
    similar: state.artist.similar,
    info: state.artist.info
  }
};

export default connect(mapStateToProps, null)(Display);