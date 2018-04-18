import { AudioSource } from 'services/audio';

export interface AudioState {
	selectedSource: AudioSource | null;
}

export type AppState = Readonly<{
	isHubConnected: boolean;
	audio: AudioState;
}>;
