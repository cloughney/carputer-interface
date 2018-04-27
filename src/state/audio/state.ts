import { AudioSource } from 'services/audio';

export enum AudioSourceState {
	Uninitialized,
	Switching,
	Initialized,
	RequiresAuthentication,
	Error
}

export interface UninitializedState {
	state: AudioSourceState.Uninitialized;
}

export interface SwitchingState {
	state: AudioSourceState.Switching;
}

export interface InitializedState {
	state: AudioSourceState.Initialized;
	source: AudioSource;
}

export interface RequiresAuthenticationState {
	state: AudioSourceState.RequiresAuthentication;
	key: string;
}

export interface ErrorState {
	state: AudioSourceState.Error;
	error: string;
}

export type AudioState = Readonly<
	UninitializedState |
	SwitchingState |
	InitializedState |
	RequiresAuthenticationState |
	ErrorState>;
