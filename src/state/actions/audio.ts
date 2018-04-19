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

export const CLEAR_AUDIO_SOURCE_ERROR = 'CLEAR_AUDIO_SOURCE_ERROR';
export type CLEAR_AUDIO_SOURCE_ERROR = typeof CLEAR_AUDIO_SOURCE_ERROR;

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

export interface ClearAudioSourceError {
    type: CLEAR_AUDIO_SOURCE_ERROR;
}

export type SelectAudioSource = SelectAudioSourceBegin | SelectAudioSourceSuccess | SelectAudioSourceFailure | ClearAudioSourceError;

const switchAudioSource = (): SelectAudioSource => ({ type: SELECT_AUDIO_SOURCE });
const receiveAudioSource = (source: AudioSource): SelectAudioSourceSuccess => ({ type: SELECT_AUDIO_SOURCE_SUCCESS, source });
const failSwitchAudioSource = (error: string): SelectAudioSourceFailure => ({ type: SELECT_AUDIO_SOURCE_FAILURE, error });

export const selectAudioSource: ActionCreator<ThunkAction<Promise<void>, AppState, void>> = (key: string) => {
    return async (dispatch, getState) => {
        dispatch(switchAudioSource());
    
        try {
            const audioSource = await audioSourceService.setActiveSource(key);
            dispatch(receiveAudioSource(audioSource));
        } catch (err) {
            console.error(err);
            dispatch(failSwitchAudioSource(`Cannot select the audio source '${key}'.`));
        }
    }
}

export const clearAudioSourceError: ActionCreator<ClearAudioSourceError> = () => ({ type: CLEAR_AUDIO_SOURCE_ERROR });