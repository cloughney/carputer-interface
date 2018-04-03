interface IAudioService {
    initialize(): Promise<void>;
    dispose(): Promise<void>;

    play(): Promise<void>;
    pause(): Promise<void>;
    nextTrack(): Promise<void>;
    previousTrack(): Promise<void>;
}

class SpotifyService implements IAudioService {
    private libElement: HTMLScriptElement | undefined;
    private player: Spotify.SpotifyPlayer | undefined;

    public constructor() {
        this.libElement = undefined;
        this.player = undefined;
    }

    public initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            window.onSpotifyWebPlaybackSDKReady = async () => {
                this.player = new Spotify.Player({
                    name: 'krikCar',
                    getOAuthToken(setToken) { setToken(''); }
                });

                this.player.addListener('initialization_error', ({ message }) => { reject(new Error(message)); });
                this.player.addListener('authentication_error', ({ message }) => { reject(new Error(message)); });
                this.player.addListener('account_error', ({ message }) => { reject(new Error(message)); });
                this.player.addListener('playback_error', ({ message }) => { reject(new Error(message)); }); // FIXME This should probably be handled internally.
                
                this.player.addListener('player_state_changed', state => { console.log(state); });

                this.player.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                    resolve();
                });

                const isConnected = await this.player.connect();
                if (isConnected) {
                    reject(new Error('Failed to connect to Spotify.'));
                }
            };

            this.libElement = document.createElement('script');
            this.libElement.src = 'https://sdk.scdn.co/spotify-player.js'; //TODO add to configuration

            window.document.body.appendChild(this.libElement);
        });
    }

    public async dispose(): Promise<void> {
        if (this.libElement === undefined || this.player === undefined) {
            return;
        }

        this.player.disconnect();
        this.player.removeListener('initialization_error');
        this.player.removeListener('authentication_error');
        this.player.removeListener('account_error');
        this.player.removeListener('playback_error');
        this.player.removeListener('player_state_changed');
        this.player.removeListener('ready');

        window.document.body.removeChild(this.libElement);

        this.player = undefined;
        this.libElement = undefined;
    }

    public async play(): Promise<void> { }
    public async pause(): Promise<void> { }
    public async nextTrack(): Promise<void> { }
    public async previousTrack(): Promise<void> { }
}