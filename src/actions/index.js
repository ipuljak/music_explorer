import axios from 'axios';
import {CURRENT_ARTIST,
        SIMILAR_ARTISTS
} from './types';

const API_TOKEN = 'BQBRM0RRGf74WNm8RhWz3j5e3ILYKykuO6GmHg36bh4P4-htRtO1lllDJemOoXupxxSaVqq7qU_HVDku5Rpsa_ug8zXI8Qd2SsCoqG1D9adGadX6XOrd0X61klenMM69k-n4UiQ5h5M';
const CLIENT_ID = '5f6d5f84020447f0b4a241fdfbfcb50b';
const CLIENT_SECRET = '0431da4c1fb9437f8dd39ea38e5e3a31';

export function searchArtist(artist) {
    const searchURL = `https://api.spotify.com/v1/search?q=${artist}&type=artist`;

    return function(dispatch) {
     //    axios.get(searchURL, {
     //     headers: {Authorization: 'Bearer ' + CLIENT_ID + ':' + CLIENT_SECRET}
     // })
     axios.get(searchURL)
        .then(response => {
            //console.log(response.data.artists.items[0]);
            dispatch({
                type: CURRENT_ARTIST,
                payload: response.data.artists.items[0]
            });

            const artistID = response.data.artists.items[0].id;
            dispatch(similarArtists(artistID));
        });
    }
}

export function similarArtists(id) {
    const similarURL = `https://api.spotify.com/v1/artists/${id}/related-artists`;

    return function(dispatch) {
     //    axios.get(similarURL, {
     //     headers: {Authorization: 'Basic ' + CLIENT_ID + ':' + CLIENT_SECRET}
     // })
     axios.get(similarURL)
        .then(response => {
            console.log("SIMILAR ARTISTS:", response.data.artists);
            dispatch({
                type: SIMILAR_ARTISTS,
                payload: response.data.artists
            });
        });
    }
}