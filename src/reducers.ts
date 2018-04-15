import { combineReducers } from 'redux';

import { AppState } from 'state';

export const appReducer = combineReducers<AppState>({
    isHubConnected: (state = false, action): AppState['isHubConnected'] => {
        switch (action.type) {
            case 'HUB_CONNECT': return true;
            case 'HUB_DISCONNECT': return false;
        }

        return state;
    },

    overlayMessage: (state = null, action): AppState['overlayMessage'] => {
        if (action.type === 'OVERLAY_MESSAGE') {
            return action.message;
        }

        return state;
    },

    audio: (state = { selectedSource: 'spotify' }, action): AppState['audio'] => {

        // switch (action.type) {
        //     case '':
        //         state.selectedSource = 'spt';
        //         break;
        // }

        return state;
    }
});
