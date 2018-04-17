import { client as hub } from 'services/hub';
import { IAudioPlayer, AudioPlayerState, Track, defaultPlayerState } from '..';
import { api } from '.';

export interface EventListeners { 'stateUpdate': (state: AudioPlayerState) => void; }
export type EventListenerMap = { [P in keyof EventListeners]: EventListeners[P][] };

export class SpotifyPlayer implements IAudioPlayer {
    private readonly eventListenerMap: EventListenerMap;
    private deviceId: string | null;
    private playerState: AudioPlayerState | null;
    private playbackInterval: number | null;

    public constructor() {
        this.eventListenerMap = {
            'stateUpdate': []
        };

        this.deviceId = null;
        this.playerState = null;
        this.playbackInterval = null;
    }

    public async initialize(): Promise<void> {
        // const response = await hub.request('spotify.player', 'initialize_player'); // TODO type the response
                
        // this.deviceId = response.deviceId;
        // this.playerState = defaultPlayerState;

        // await (api as any).transferMyPlayback([ this.deviceId ]);

        // const spotifyState = await api.getplayerstate
        // if (spotifyState === null) {
        //     this.playerState = defaultPlayerState;
        //     return;
        // }

        //this.onStateUpdate(spotifyState);

        this.playbackInterval = setInterval(() => {
            //const response = await api.getplayerstate
        }, 2000);
    }

    public async dispose(): Promise<void> {
        if (this.deviceId === null || this.playbackInterval === null) {
            return;
        }

        clearInterval(this.playbackInterval);

        Object.getOwnPropertyNames(this.eventListenerMap).forEach(x => {
            this.eventListenerMap[x as keyof EventListeners] = [];
        });

        this.playerState = null;
        this.deviceId = null;
    }

    public addEventListener<T extends keyof EventListeners>(eventName: T, listener: EventListeners[T]): void {
        this.eventListenerMap[eventName].push(listener);
    }

    public async setTracks(tracks: Track[]): Promise<void> {
        if (this.deviceId !== null) {
            //await api.tracks
        }
    }

    public async play(): Promise<void> {
        if (this.deviceId !== null) {
            //await api.play
        }
    }

    public async pause(): Promise<void> {
        if (this.deviceId !== null) {
            //await api.pause
        }
    }

    public async nextTrack(): Promise<void> {
        if (this.deviceId !== null) {
            //await api.next
        }
    }

    public async previousTrack(): Promise<void> {
        if (this.deviceId !== null) {
            //await api.prev
        }
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
}