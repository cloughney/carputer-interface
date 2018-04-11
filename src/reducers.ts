import { combineReducers } from 'redux';

import { AppState } from 'state';

export const appReducer = combineReducers<AppState>({
    isHubConnected: (state = false, action) => {
        switch (action.type) {
            case 'HUB_CONNECT': return true;
            case 'HUB_DISCONNECT': return false;
        }

        return state;
    },
    audio: (state, action) => {
        return {};
    }
});
