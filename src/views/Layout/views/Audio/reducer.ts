import { AudioState, AudioSource } from 'state/audio';
import { SELECT_AUDIO_SOURCE } from './actions';

type Action = { type: typeof SELECT_AUDIO_SOURCE, source: AudioSource };

export const initialState = {
	selectedSource: undefined
};

export default function audio(state: AudioState = initialState, action: Action): AudioState {
	switch (action.type) {
		case SELECT_AUDIO_SOURCE:
			return { ...state, selectedSource: action.source };
		default:
			return state;
	}
}
