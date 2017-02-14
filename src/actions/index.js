import _ from 'lodash';
import axios from 'axios';
import createTree from '../data_visualization/tree';
import { dispatch as storeDispatch } from '../index.js';
import { lastfm_API_KEY } from '../secrets.js';

import {
  CURRENT_ARTIST,
  ARTIST_INFO,
  TOP_TRACKS
} from './types';

// Define the root URL for the last.fm API
const ROOT_URL = 'https://api.spotify.com/v1/';
// Keep track of the artists that the user has visited
let visited = [];

/**
 * ========================================================
 *                ARTIST EXPLORER ACTIONS
 * ========================================================
 */

/**
 *  Set the current artist
 */
export const setCurrentArtist = artist => {
  storeDispatch({
    type: CURRENT_ARTIST,
    payload: artist
  });
};

/**
 *  Retrieve a bio about the given artist
 */
export const getArtistInfo = artist => {
  // Create the full URL of the API call
  let lastfm = 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=';
  let lastfm_params = `&api_key=${lastfm_API_KEY}&format=json&autocorrect=1`
  const LASTFM_URL = `${lastfm}${artist}${lastfm_params}`;

  return axios.get(LASTFM_URL)
    .then(response => {
      storeDispatch({
        type: ARTIST_INFO,
        payload: response.data.artist
      });
    });
};

/**
 *  Return a list of tracks given an artist ID
 */
export const getTracks = id => {
  // Create the full URL of the API call
  const TRACKS_URL = `${ROOT_URL}artists/${id}/top-tracks?country=US`;

  return axios.get(TRACKS_URL)
    .then(response => {
      storeDispatch({
        type: TOP_TRACKS,
        payload: response.data.tracks
      });
    });
};

/**
 *  Return the information about a given searched artist
 */
export const searchArtist = artist => {
  // The full URL to make the GET call to
  const SEARCH_URL = `${ROOT_URL}search?q=${artist}&type=artist`;
  // Empty the visited artists array on any search
  visited = [];

  return dispatch => {
    axios.get(SEARCH_URL)
      .then(response => {
        // Use the first artist in the dataset as it's likely to be the closest match
        const currentArtist = response.data.artists.items[0];
        // Add the artist to the visited artists array
        visited.push(currentArtist.name);
        // Set the current artist and info
        setCurrentArtist(currentArtist);
        getArtistInfo(currentArtist.name);
        getTracks(currentArtist.id);
        // Create a fresh artist object to be rendered into a D3 tree
        const artistObject = {
          aid: currentArtist.id,
          id: 0,
          name: currentArtist.name,
          image: currentArtist.images[currentArtist.images.length - 2].url
        };
        // Create the tree
        createTree(artistObject);
      });
  }
};

/**
 *  Return a list of 5 similar artists to the given artist
 */
export const getSimilar = id => {
  // Create the full URL of the API call
  const similarROOT_URL = `${ROOT_URL}artists/${id}/related-artists`;

  return axios.get(similarROOT_URL)
    .then(result => {
      // Instantiate some variables and read in all of the similar artists
      let uniques = [];
      let counter = 0;
      let allArtists = result.data.artists;

      // Loop through all of the similar artists
      for (var x = 0; x < allArtists.length; x++) {
        // If the similar artist hasn't been viewed yet by the user, add it to the visited array
        if (_.indexOf(visited, allArtists[x].name) === -1) {
          counter++;
          visited.push(allArtists[x].name);
          uniques.push(allArtists[x]);
          // If we reach 5 non visited similar artists, stop the function
          if (counter === 5) {
            break;
          }
        }
      }
      return uniques;
    });
};