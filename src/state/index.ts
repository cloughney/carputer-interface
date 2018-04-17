export interface AudioState {
	selectedSource: string | null;
}

export type AppState = Readonly<{
	isHubConnected: boolean;
	audio: AudioState;
}>;
