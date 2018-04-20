import { Reducer } from 'redux';
import { AudioState } from '..';
import * as Actions from 'state/actions';

export const audioReducer: Reducer<AudioState> = (state = {
	isSwitchingSource: false,
	selectedSource: null,
	sourceError: null,
	requiresAuthentication: false
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

		case Actions.SELECT_AUDIO_SOURCE_REQUIRES_AUTHENTICATION:
			return {
				...state,
				isSwitchingSource: false,
				selectedSource: null,
				requiresAuthentication: true
			};

		case Actions.CLEAR_AUDIO_SOURCE_ERROR:
			return {
				...state,
				sourceError: null,
				requiresAuthentication: false
			};
		
		default: return state;
	}
}
