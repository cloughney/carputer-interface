import { ILibraryBrowser } from '..';
import { StreamPlayer } from './stream-player';
import { StreamLibraryBrowser } from './stream-browser';

let isInitialized = false;

const player = new StreamPlayer();
const browser = new StreamLibraryBrowser();

export default {
	browser,
	player,

	async initialize(): Promise<void> {
		if (!isInitialized) {
			await player.initialize();
			isInitialized = true;
		}
	},

	async dispose(): Promise<void> {
		if (isInitialized) {
			await player.dispose();
			isInitialized = false;
		}
	}
};
