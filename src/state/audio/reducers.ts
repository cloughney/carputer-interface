import { Reducer } from 'redux';
import { AudioState, AudioSourceState } from '..';
import * as Actions from './actions';

const storedStateKey = 'carputer.state.audio.stored_state';
const defaultState: AudioState = {
	state: AudioSourceState.Uninitialized
};

export const audioReducer: Reducer<AudioState> = (state, action: Actions.SelectAudioSource) => {
	if (state === undefined) {
		const storedState = window.sessionStorage.getItem(storedStateKey);
		state = storedState ? JSON.parse(storedState) : defaultState;
	} else {
		window.sessionStorage.removeItem(storedStateKey);
	}

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
			state = {
				state: AudioSourceState.RequiresAuthentication,
				key: action.key
			};

			// Retain the state when the audio source requires authentication because this may require a page redirect.
			window.sessionStorage.setItem(storedStateKey, JSON.stringify(state));
			return state;

		case Actions.RESET_AUDIO_SOURCE_STATE:
			return { state: AudioSourceState.Uninitialized };
		
		default:
			return state;
	}
}
