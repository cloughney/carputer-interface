import { Dispatch, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ActionCreator } from 'react-redux';
import { AppState } from 'state';
import { AudioSource, audioSourceService } from 'services/audio';

export const SELECT_AUDIO_SOURCE = 'SELECT_AUDIO_SOURCE';
export type SELECT_AUDIO_SOURCE = typeof SELECT_AUDIO_SOURCE;

export const SELECT_AUDIO_SOURCE_SUCCESS = 'SELECT_AUDIO_SOURCE_SUCCESS';
export type SELECT_AUDIO_SOURCE_SUCCESS = typeof SELECT_AUDIO_SOURCE_SUCCESS;

export const SELECT_AUDIO_SOURCE_FAILURE = 'SELECT_AUDIO_SOURCE_FAILURE';
export type SELECT_AUDIO_SOURCE_FAILURE = typeof SELECT_AUDIO_SOURCE_FAILURE;

export const SELECT_AUDIO_SOURCE_REQUIRES_AUTHENTICATION = 'SELECT_AUDIO_SOURCE_REQUIRES_AUTHENTICATION';
export type SELECT_AUDIO_SOURCE_REQUIRES_AUTHENTICATION = typeof SELECT_AUDIO_SOURCE_REQUIRES_AUTHENTICATION;

export const SELECT_AUDIO_SOURCE_COMPLETE_AUTHENTICATION = 'SELECT_AUDIO_SOURCE_COMPLETE_AUTHENTICATION';
export type SELECT_AUDIO_SOURCE_COMPLETE_AUTHENTICATION = typeof SELECT_AUDIO_SOURCE_COMPLETE_AUTHENTICATION;

export const RESET_AUDIO_SOURCE_STATE = 'RESET_AUDIO_SOURCE_STATE';
export type RESET_AUDIO_SOURCE_STATE = typeof RESET_AUDIO_SOURCE_STATE;

export interface SelectAudioSourceBegin {
    type: SELECT_AUDIO_SOURCE;
}

export interface SelectAudioSourceSuccess {
    type: SELECT_AUDIO_SOURCE_SUCCESS;
    source: AudioSource;
}

export interface SelectAudioSourceFailure {
    type: SELECT_AUDIO_SOURCE_FAILURE;
    error: string;
}

export interface SelectAudioSourceRequiresAuthentication {
	type: SELECT_AUDIO_SOURCE_REQUIRES_AUTHENTICATION;
	key: string;
}

export interface CompleteAudioSourceAuthentication {
	type: SELECT_AUDIO_SOURCE_COMPLETE_AUTHENTICATION;
}

export interface ResetAudioSourceState {
    type: RESET_AUDIO_SOURCE_STATE;
}

export type SelectAudioSource = 
	SelectAudioSourceBegin | 
	SelectAudioSourceSuccess | 
	SelectAudioSourceFailure | 
	SelectAudioSourceRequiresAuthentication |
	ResetAudioSourceState;

const beginSourceSwitch = (): SelectAudioSource => ({ type: SELECT_AUDIO_SOURCE });
const completeSourceInitialization = (source: AudioSource): SelectAudioSourceSuccess => ({ type: SELECT_AUDIO_SOURCE_SUCCESS, source });
const failSourceInitialization = (error: string): SelectAudioSourceFailure => ({ type: SELECT_AUDIO_SOURCE_FAILURE, error });
const requireSourceAuthentication = (key: string): SelectAudioSourceRequiresAuthentication => ({ type: SELECT_AUDIO_SOURCE_REQUIRES_AUTHENTICATION, key });

export const selectAudioSource: ActionCreator<ThunkAction<Promise<void>, AppState, void>> = (key: string) => {
    return async (dispatch, getState) => {
        dispatch(beginSourceSwitch());
    
        try {
            const audioSource = await audioSourceService.setActiveSource(key);
            dispatch(completeSourceInitialization(audioSource));
        } catch (err) {
			if (err.type === 'authentication') {
				dispatch(requireSourceAuthentication(key));
				return;
			}
			
            console.error(err);
            dispatch(failSourceInitialization('Failed to select the audio source.'));
        }
    }
}

export const completeAudioSourceAuthentication: ActionCreator<CompleteAudioSourceAuthentication> = () => ({ type: SELECT_AUDIO_SOURCE_COMPLETE_AUTHENTICATION });
export const resetAudioSourceState: ActionCreator<ResetAudioSourceState> = () => ({ type: RESET_AUDIO_SOURCE_STATE });
