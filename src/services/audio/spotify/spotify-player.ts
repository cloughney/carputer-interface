import { IAudioPlayer, AudioPlayerState, Track, defaultPlayerState } from '..';
import { api } from '.';

interface EventListeners {
    'stateUpdate': (state: AudioPlayerState) => void;
}

type EventListenerMap = { [P in keyof EventListeners]: EventListeners[P][] };

export class SpotifyPlayer implements IAudioPlayer {
    private readonly eventListenerMap: EventListenerMap;
    private libElement: HTMLScriptElement | null;
    private player: Spotify.SpotifyPlayer | null;
    private playerDeviceId: string | null;
    private playerState: AudioPlayerState | null;
    private playbackInterval: number | null;

    public constructor() {
        this.eventListenerMap = {
            'stateUpdate': []
        };

        this.libElement = null;
        this.player = null;
        this.playerDeviceId = null;
        this.playerState = null;
        this.playbackInterval = null;
    }

    public initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            window.onSpotifyWebPlaybackSDKReady = async () => {
                this.player = new Spotify.Player({
                    name: 'krikCar', //TODO add to configuration
                    getOAuthToken(setToken) {
                        const token = api.getAccessToken();
                        if (token === null) {
                            reject({ type: 'authentication' });
                            return;
                        }

                        setToken(token);
                    }
                });

                this.player.addListener('authentication_error', ({ message }) => { reject({ type: 'authentication' }); });
                this.player.addListener('initialization_error', (err) => { console.log(err); reject(new Error(err.message)); });
                this.player.addListener('account_error', ({ message }) => { reject(new Error(message)); });

                this.player.addListener('player_state_changed', this.onStateUpdate);
                this.player.addListener('playback_error', this.onPlaybackError);

                this.player.addListener('ready', async ({ device_id }) => {
                    if (this.player !== null) {
                        await this.onPlayerReady(this.player, device_id);
                        resolve();
                    } else {
                        reject();
                    }
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

        Object.getOwnPropertyNames(this.eventListenerMap).forEach(x => {
            this.eventListenerMap[x as keyof EventListeners] = [];
        });

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

    public addEventListener<T extends keyof EventListeners>(eventName: T, listener: EventListeners[T]): void {
        this.eventListenerMap[eventName].push(listener);
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

    private async onPlayerReady(player: Spotify.SpotifyPlayer, deviceId: string): Promise<void> {
        this.playerDeviceId = deviceId;
        await (api as any).transferMyPlayback([deviceId]);
        
        const spotifyState = await player.getCurrentState();
        if (spotifyState === null) {
            this.playerState = defaultPlayerState;
            return;
        }

        this.onStateUpdate(spotifyState);
    }

    private onStateUpdate = (state: Spotify.PlaybackState): void => {
        const { current_track: currentTrack } = state.track_window;

        const playerState = this.playerState = {
            playback: {
                isPlaying: !state.paused,
                trackPosition: state.position
            },
            currentTrack: {
                uri: null,
                id: null,
                name: currentTrack.name,
                duration: (currentTrack as any).duration_ms,
                album: {
                    name: currentTrack.album.name,
                    images: []
                },
                artists: currentTrack.artists.map(x => ({
                    name: x.name
                }))
            },
            nextTracks: [],
            previousTracks: []
        };

        this.eventListenerMap.stateUpdate.forEach(x => x(playerState));
    }

    private onPlaybackError = (err: Spotify.Error): void => {
        
    }
}