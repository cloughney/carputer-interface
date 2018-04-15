import { IAudioPlayer, Track } from '../';
import { api } from '.';

export class SpotifyPlayer implements IAudioPlayer {
    private libElement: HTMLScriptElement | null;
    private player: Spotify.SpotifyPlayer | null;
    private playerDeviceId: string | null;
    private playerState: Spotify.PlaybackState | null;

    public constructor() {
        this.libElement = null;
        this.player = null;
        this.playerDeviceId = null;
        this.playerState = null;
    }

    public initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            window.onSpotifyWebPlaybackSDKReady = async () => {

                this.player = new Spotify.Player({
                    name: 'krikCar', //TODO add to configuration
                    getOAuthToken(setToken) { setToken(api.getAccessToken()); }
                });

                this.player.addListener('initialization_error', ({ message }) => { reject(new Error(message)); });
                this.player.addListener('authentication_error', ({ message }) => {
                    window.location.hash = '#/audio/spotify/connect';
                });

                this.player.addListener('account_error', ({ message }) => { reject(new Error(message)); });
                this.player.addListener('playback_error', ({ message }) => { reject(new Error(message)); }); // FIXME This should probably be handled internally.

                this.player.addListener('player_state_changed', state => { this.playerState = state; console.log(state); });

                this.player.addListener('ready', async ({ device_id }) => {
                    if (this.player === null) {
                        reject();
                        return;
                    }

                    this.playerDeviceId = device_id;
                    await (api as any).transferMyPlayback([device_id]);

                    resolve();
                });

                await this.player.connect();
            };

            this.libElement = document.createElement('script');
            this.libElement.src = 'https://sdk.scdn.co/spotify-player.js'; //TODO add to configuration

            window.document.head.appendChild(this.libElement);
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

        window.document.head.removeChild(this.libElement);

        this.playerState = null;
        this.playerDeviceId = null;
        this.player = null;
        this.libElement = null;
    }

    public async setTracks(tracks: Track[]): Promise<void> {

    }

    public async play(): Promise<void> {
        if (this.player === null) {
            return;
        }

        await this.player.togglePlay();
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