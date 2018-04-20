import { AudioState } from './audio/state';

export type UserConfiguration = Readonly<{

}>;

export type AppState = Readonly<{
	isHubConnected: boolean;
	audio: AudioState;
	configuration: UserConfiguration;
}>;

export * from './audio/state';
