import { combineReducers } from 'redux';

import { AppState } from 'state';

export const appReducer = combineReducers<AppState>({
    audio: (state, action) => {
        return {};
    }
});
