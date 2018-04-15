export interface AudioState {
	selectedSource: string;
}

export type AppState = Readonly<{
	isHubConnected: boolean;
	audio: AudioState;
}>;
