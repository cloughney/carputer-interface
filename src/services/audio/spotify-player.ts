import { IAudioPlayer, Track } from './audio-player';

class SpotifyService {
    
}

export class SpotifyPlayer implements IAudioPlayer {
    private libElement: HTMLScriptElement | null;
    private player: Spotify.SpotifyPlayer | null;
    private playerId: string | null;
    private playerState: Spotify.PlaybackState | null;

    public constructor() {
        this.libElement = null;
        this.player = null;
        this.playerId = null;
        this.playerState = null;
    }

    public initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            window.onSpotifyWebPlaybackSDKReady = async () => {
                this.player = new Spotify.Player({
                    name: 'krikCar', //TODO add to configuration
                    getOAuthToken(setToken) { setToken(''); }
                });

                this.player.addListener('initialization_error', ({ message }) => { reject(new Error(message)); });
                this.player.addListener('authentication_error', ({ message }) => { reject(new Error(message)); });
                this.player.addListener('account_error', ({ message }) => { reject(new Error(message)); });
                this.player.addListener('playback_error', ({ message }) => { reject(new Error(message)); }); // FIXME This should probably be handled internally.

                this.player.addListener('player_state_changed', state => { this.playerState = state; console.log(state); });

                this.player.addListener('ready', ({ device_id }) => {
                    this.playerId = device_id;
                    resolve();
                });

                await this.player.connect();
            };

            this.libElement = document.createElement('script');
            this.libElement.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js'); //TODO add to configuration

            window.document.body.appendChild(this.libElement);
        });
    }

    public async dispose(): Promise<void> {
        if (this.libElement === null || this.player === null) {
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

        this.playerState = null;
        this.playerId = null;
        this.player = null;
        this.libElement = null;
    }

    public async setTracks(tracks: Track[]): Promise<void> {

    }

    public async play(): Promise<void> {
        if (this.player === null) {
            return;
        }

        await this.player.resume();
    }

    public async pause(): Promise<void> {
        if (this.player === null) {
            return;
        }

        await this.player.pause();
    }

    public async nextTrack(): Promise<void> { }
    public async previousTrack(): Promise<void> { }
}