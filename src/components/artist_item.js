import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setCurrentArtist} from '../actions';
import {bindActionCreators} from 'redux';

class ArtistItem extends Component {
    update() {
        this.props.setCurrentArtist(this.props.item);
        //this.props.similarArtists(this.props.item.id);
    }
    render() {
        return (
            <li onClick={() => this.update()}>
                {this.props.item.name}
            </li>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({setCurrentArtist, similarArtists}, dispatch);
}

export default connect(null, mapDispatchToProps)(ArtistItem);