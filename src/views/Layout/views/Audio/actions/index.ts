export const SELECT_AUDIO_SOURCE = 'SELECT_AUDIO_SOURCE';

export const selectAudioSource = (source: {}) => ({
	type: SELECT_AUDIO_SOURCE as typeof SELECT_AUDIO_SOURCE,
	source
});
