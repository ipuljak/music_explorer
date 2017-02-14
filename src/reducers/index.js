import { combineReducers } from 'redux';

import artistReducer from './artist_reducer';

// Combine the reducers to form the root reducer
const rootReducer = combineReducers({
  artist: artistReducer
});

export default rootReducer;