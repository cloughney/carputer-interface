import { AudioSource } from 'services/audio';

export type AudioState = Readonly<{
	isSwitchingSource: boolean;
	selectedSource: AudioSource | null;
	sourceError: string | null;
	requiresAuthentication: boolean
}>;

export type UserConfiguration = Readonly<{

}>;

export type AppState = Readonly<{
	isHubConnected: boolean;
	audio: AudioState;
	configuration: UserConfiguration;
}>;
