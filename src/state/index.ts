import { AudioState } from './audio';

export type AppState = Readonly<{
	audio: AudioState | undefined;
}>;
