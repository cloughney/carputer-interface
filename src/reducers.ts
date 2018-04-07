import { combineReducers } from 'redux';

import { AppState } from 'state';

export const appReducer = combineReducers<AppState>({
    isHubConnected: (state = false, action) => {
        switch (action.type) {
            case 'HUB_CONNECT':
                return true;
        }

        return state;
    },
    audio: (state, action) => {
        return {};
    }
});
