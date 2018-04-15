export interface AudioState {
	selectedSource: string;
}

export type AppState = Readonly<{
	isHubConnected: boolean;
	overlayMessage: string | null;
	audio: AudioState;
}>;
