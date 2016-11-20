import _ from 'lodash';
import axios from 'axios';
import {CURRENT_ARTIST,
        SIMILAR_ARTISTS
} from './types';
import createTree from '../data_visualization/tree';

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
            visited.push(currentArtist.name);
            dispatch(setCurrentArtist(currentArtist));
            //dispatch(similarArtists(currentArtist.id));
            const artistObject = {
                aid: currentArtist.id,
                id: 0,
                name: currentArtist.name,
                image: currentArtist.images[currentArtist.images.length - 2].url
            };
            createTree(artistObject);
        });
    }
}

/** 
    Set the current artist.
*/
export function setCurrentArtist(artist) {
    return {
        type: CURRENT_ARTIST,
        payload: artist
    };
}

/** 
    Return a list of similar artists to the given artist. Returns 20 for now.
*/
// export function similarArtists(id) {
//     const similarURL = `${URL}artists/${id}/related-artists`;

//     return function(dispatch) {
//      axios.get(similarURL)
//         .then(response => {
//             const sliced = response.data.artists.slice(0,5);
//             return sliced;
//             // dispatch({
//             //     type: SIMILAR_ARTISTS,
//             //     payload: sliced
//             // });
//             //return({artists: sliced});
//         });
//     }
// }

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