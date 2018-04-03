export interface AudioSource {
	slug: string;
	title: string;
	href: string;
}

export interface AudioState {
	selectedSource: AudioSource|undefined;
}

export type AppState = Readonly<{
	audio: AudioState | undefined;
}>;
