//import { MopidySpotifyAudioPlayerSource } from './audio-sources';

export default class AudioPlayer {
	private sources: IAudioPlayerSource[];

	public constructor() {
		this.sources = [
			//new MopidySpotifyAudioPlayerSource()
		];
	}
}
