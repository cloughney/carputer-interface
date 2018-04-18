import { AudioSource } from 'services/audio';

export type AudioState = Readonly<{
	isSwitchingSource: boolean;
	selectedSource: AudioSource | null;
	sourceError: string | null;
}>;

export type AppState = Readonly<{
	isHubConnected: boolean;
	audio: AudioState;
}>;

