import { IAudioPlayer, Track } from './audio-player';

class SpotifyApi {

    public constructor() {
        this.isAuthenticated = false;
    }

    public isAuthenticated: boolean;

    public authenticate(): void {
        const clientId = '';
        const authUrl = 'https://accounts.spotify.com/authorize';
        const scope = 'user-read-private user-read-email';
        
        const state = this.generateStateValue();
        window.localStorage.setItem('spotify.auth.state', state);

        const params: { [key: string]: string } = {
            'response_type': 'token',
            'client_id': clientId,
            'scope': scope,
            'redirect_uri': '',
            'state': state
        };

        let queryString = '?';
        Object.getOwnPropertyNames(params).forEach(x => 
            queryString += `${x}=${encodeURIComponent(params[x])}`);

        const url = `${authUrl}${queryString}`;
        window.location.assign(url);
    }

    private getParamsFromHash(): { [key: string]: string } {
        const hashParams: { [key: string]: string } = {};
        const paramPattern = /([^&;=]+)=?([^&;]*)/g;
        const hash = window.location.hash.substring(1);

        let match: RegExpExecArray | null;
        while (match = paramPattern.exec(hash)) {
            hashParams[match[1]] = decodeURIComponent(match[2]);
        }

        return hashParams;
    }

    private generateStateValue(): string {
        let output = '';

        const length = 16;
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        for (let i = 0; i < length; i++) {
            output += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return output;
    }
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