import {
    CURRENT_ARTIST,
    SIMILAR_ARTISTS
} from '../actions/types';

export default function(state = {}, action) {
    switch(action.type)  {
        case CURRENT_ARTIST:
            return {...state, data: action.payload};
        case SIMILAR_ARTISTS:
            return {...state, similar: action.payload};
    }

    return state;
}