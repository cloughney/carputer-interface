import { combineReducers } from 'redux';
import { AppState } from 'state';
import * as Actions from 'state/actions';

import { audioReducer as audio } from './audio/reducers';
import { configurationReducer as configuration } from './configuration/reducers';

export const appReducer = combineReducers<AppState>({
    isHubConnected: (state: AppState['isHubConnected'] = false, action: Actions.HubConnection) => {
        switch (action.type) {
            case Actions.HUB_CONNECTED: return true;
            case Actions.HUB_DISCONNECTED: return false;
            default: return state;
        }
    },

	audio,
	configuration
});
