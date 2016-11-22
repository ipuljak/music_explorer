import {
    CURRENT_ARTIST,
    SIMILAR_ARTISTS,
    ARTIST_INFO,
    TOP_TRACKS
} from '../actions/types';

export default function(state = {}, action) {
    switch(action.type)  {
        case CURRENT_ARTIST:
            console.log("CURRENT REDUCER", action.payload);
            return {...state, data: action.payload};
        case SIMILAR_ARTISTS:
            console.log("SIMILAR REDUCER", action.payload);
            return {...state, similar: action.payload};
        case ARTIST_INFO:
            console.log("INFO REDUCER", action.payload);
            return {...state, info: action.payload};
        case TOP_TRACKS:
            console.log("TRACKS REDUCER", action.payload);
            return {...state, tracks: action.payload};
    }

    return state;
}