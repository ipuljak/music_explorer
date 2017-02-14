import {
  CURRENT_ARTIST,
  SIMILAR_ARTISTS,
  ARTIST_INFO,
  TOP_TRACKS
} from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    // Set the current artist that the user requested
    case CURRENT_ARTIST:
      return {...state, data: action.payload };
    // Set the similar artists to the current artist
    case SIMILAR_ARTISTS:
      return {...state, similar: action.payload };
    // Set some info regarding the current artist
    case ARTIST_INFO:
      return {...state, info: action.payload };
    // Set the top tracks of the current artist
    case TOP_TRACKS:
      return {...state, tracks: action.payload };
    default:
      return state;
  }
};