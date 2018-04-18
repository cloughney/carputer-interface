import { combineReducers } from 'redux';
import { AppState } from 'state';
import * as Actions from 'state/actions';

export const appReducer = combineReducers<AppState>({
    isHubConnected: (state: AppState['isHubConnected'] = false, action: Actions.HubConnection) => {
        switch (action.type) {
            case Actions.HUB_CONNECTED: return true;
            case Actions.HUB_DISCONNECTED: return false;
            default: return state;
        }
    },

    audio: (state: AppState['audio'] = {
        isSwitchingSource: false,
        selectedSource: null,
        sourceError: null
    }, action: Actions.SelectAudioSource) => {

        switch (action.type) {
            case Actions.SELECT_AUDIO_SOURCE:
                return { ...state, isSwitchingSource: true };
            
            case Actions.SELECT_AUDIO_SOURCE_SUCCESS:
                return {
                    ...state,
                    isSwitchingSource: false,
                    selectedSource: action.source
                };

            case Actions.SELECT_AUDIO_SOURCE_FAILURE:
                return {
                    ...state,
                    isSwitchingSource: false,
                    selectedSource: null,
                    sourceError: action.error
                };
            
            default: return state;
        }
    }
});
