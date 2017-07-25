interface IAudioPlayerSource {
	isAvailable: boolean;

	/*
	 * Get a list of playlists from this source.
	 */
	getPlaylists(): Promise<any[]>;
}

interface Playlist {
	source: IAudioPlayerSource;
	id: string;
	name: string;
}
