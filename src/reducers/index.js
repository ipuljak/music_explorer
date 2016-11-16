import { combineReducers } from 'redux';
import artistReducer from './artist_reducer';

const rootReducer = combineReducers({
  artist: artistReducer
});

export default rootReducer;
