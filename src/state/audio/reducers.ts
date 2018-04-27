import { Reducer } from 'redux';
import { AudioState, AudioSourceState } from '..';
import * as Actions from './actions';

export const audioReducer: Reducer<AudioState> = (state = {
	state: AudioSourceState.Uninitialized
}, action: Actions.SelectAudioSource) => {

	switch (action.type) {

		case Actions.SELECT_AUDIO_SOURCE:
			return { state: AudioSourceState.Switching };
		
		case Actions.SELECT_AUDIO_SOURCE_SUCCESS:
			return {
				state: AudioSourceState.Initialized,
				source: action.source
			};

		case Actions.SELECT_AUDIO_SOURCE_FAILURE:
			return {
				state: AudioSourceState.Error,
				error: action.error
			};

		case Actions.SELECT_AUDIO_SOURCE_REQUIRES_AUTHENTICATION:
			return {
				state: AudioSourceState.RequiresAuthentication,
				key: action.key
			};

		case Actions.RESET_AUDIO_SOURCE_STATE:
			return { state: AudioSourceState.Uninitialized };
		
		default: return state;
	}
}
