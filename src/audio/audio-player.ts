import { MopidySpotifyAudioPlayerSource } from './sources';

export default class AudioPlayer {
	private sources: IAudioPlayerSource[];

	public constructor() {
		this.sources = [
			new MopidySpotifyAudioPlayerSource()
		];
	}
}
