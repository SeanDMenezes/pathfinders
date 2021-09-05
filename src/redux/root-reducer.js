import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // where we want to store our reducer

import blockReducer from './block/block-reducer';
import optionsReducer from './options/options-reducer';

const persistConfig = {
    key: 'root',
    storage
}

const rootReducer = combineReducers({
    blocks: blockReducer,
    options: optionsReducer
});


export default persistReducer(persistConfig, rootReducer);