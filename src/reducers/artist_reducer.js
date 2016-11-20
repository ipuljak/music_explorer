import {
    CURRENT_ARTIST,
    SIMILAR_ARTISTS
} from '../actions/types';

export default function(state = {}, action) {
    switch(action.type)  {
        case CURRENT_ARTIST:
            console.log("CURRENT REDUCER", action.payload);
            return {...state, data: action.payload};
        case SIMILAR_ARTISTS:
            console.log("SIMILAR REDUCER", action.payload);
            return {...state, similar: action.payload};
    }

    return state;
}