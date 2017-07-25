declare class Mopidy {
	constructor(config: {});

	on(handler: Function): void;
	on(eventName: string, handler: Function): void;

	playlists: Mopidy.PlaylistController;
}

declare namespace Mopidy {
	class Playlist {
		name: string;
		length: number;
		uri: string;
	}

	class PlaylistController {
		getPlaylists(): Promise<Playlist[]>;
	}
}
