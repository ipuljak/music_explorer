import _ from 'lodash';
import axios from 'axios';
import createTree from '../data_visualization/tree';
import {dispatch as storeDispatch} from '../index.js';
import {lastFM_API_KEY} from '../../config';

import {CURRENT_ARTIST,
        SIMILAR_ARTISTS,
        ARTIST_INFO,
        TOP_TRACKS
} from './types';

const URL = 'https://api.spotify.com/v1/';

var visited = [];

/** 
    Return the information about a given searched artist.
*/
export function searchArtist(artist) {
    const searchURL = `${URL}search?q=${artist}&type=artist`;

    return function(dispatch) {
     axios.get(searchURL)
        .then(response => {
            const currentArtist = response.data.artists.items[0];

            // Add the artist to the visited artists array
            visited.push(currentArtist.name);

            // Set the current artist and info
            setCurrentArtist(currentArtist);
            getArtistInfo(currentArtist.name);
            getTracks(currentArtist.id);
            
            // create a fresh artist object to be rendered into a D3 tree
            const artistObject = {
                aid: currentArtist.id,
                id: 0,
                name: currentArtist.name,
                image: currentArtist.images[currentArtist.images.length - 2].url
            };

            // create the tree
            createTree(artistObject);
        });
    }
}

/** 
    Set the current artist.
*/
export function setCurrentArtist(artist) {
    storeDispatch({
        type: CURRENT_ARTIST,
        payload: artist
    });
}

export function getArtistInfo(artist) {
    const lastFM = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=';
    const lastFM_params = `&api_key=${lastFM_API_KEY}&format=json&autocorrect=1`
    const lastFM_URL = `${lastFM}${artist}${lastFM_params}`;

    return axios.get(lastFM_URL)
        .then(response => {
            storeDispatch({
                type: ARTIST_INFO,
                payload: response.data.artist
            });
        });
}

/** 
    Return a list of similar artists to the given artist. Returns 20 for now.
*/
export function getSimilar(id) {
    const similarURL = `${URL}artists/${id}/related-artists`;
    return axios.get(similarURL)
        .then(function(result) {

            var allArtists = result.data.artists;
            var uniques = [];
            var counter = 0;

            for (var x=0; x<allArtists.length; x++) {
                if (_.indexOf(visited, allArtists[x].name) === -1) {
                    counter++;
                    visited.push(allArtists[x].name);
                    uniques.push(allArtists[x]);

                    if (counter === 5) {
                        break;
                    }
                }
            }
            return uniques;
        });
}

/**
 *  Return a list of tracks given an artist ID.
 */
export function getTracks(id) {
    const tracksURL = `${URL}artists/${id}/top-tracks?country=US`;

    return axios.get(tracksURL)
        .then(response => {
            storeDispatch({
                type: TOP_TRACKS,
                payload: response.data.tracks
            });
        });    
}