// export class MopidySpotifyAudioPlayerSource implements IAudioPlayerSource {
// 	private providerUris: string[];
// 	private mopidy: Mopidy;
// 	private isOnline: boolean;
//
// 	public constructor() {
// 		this.providerUris = ['spotify:'];
// 		this.isOnline = false;
//
// 		this.mopidy = new Mopidy({ webSocketUrl: "ws://192.168.1.153:6680/mopidy/ws/" });
// 		this.mopidy.on('state:online', () => { this.isOnline = true; });
// 		this.mopidy.on('state:offline', () => { this.isOnline = false; });
// 	}
//
// 	public get isAvailable(): boolean {
// 		return this.isOnline;
// 	}
//
// 	public async getPlaylists(): Promise<any[]> {
// 		if (!this.isOnline) {
// 			return [];
// 		}
//
// 		try {
// 			const playlists = await this.mopidy.playlists.getPlaylists();
// 			return playlists.map(x => ({
// 				source: this,
// 				id: x.uri,
// 				name: x.name
// 			}));
// 		} catch (err) {
// 			console.dir(err);
// 		}
// 	}
// }
