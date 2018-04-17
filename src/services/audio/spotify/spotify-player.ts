import { client as hub } from 'services/hub';
import { IAudioPlayer, AudioPlayerState, AudioPlayerEventListeners as EventListeners, AudioPlayerEventListenerMap, Track, defaultPlayerState } from '..';
import spotify from '.';

export class SpotifyPlayer implements IAudioPlayer {
    private readonly eventListenerMap: AudioPlayerEventListenerMap;
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

        const { devices } = await spotify.api.getMyDevices();

        const deviceName = 'Living Room Dot';
        const device = devices.find(x => x.name === deviceName);
        if (device === undefined || device.id === null) {
            throw new Error(`Cannot find a device with the name '${deviceName}'.`);
        }
                
        this.deviceId = device.id;

        await spotify.api.transferMyPlayback([ this.deviceId ]);

        this.playbackInterval = setInterval(async () => {
            const spotifyState = await spotify.api.getMyCurrentPlaybackState();
            this.onStateUpdate(spotifyState);
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

    public removeEventListener<T extends keyof EventListeners>(eventName: T, listener: EventListeners[T]): void {
        const listenerIndex = this.eventListenerMap[eventName].indexOf(listener);
        this.eventListenerMap[eventName].splice(listenerIndex, 1);
    }

    public async setTracks(tracks: Track[]): Promise<void> {
        if (this.deviceId !== null) {
            //await api.tracks
        }
    }

    public async play(): Promise<void> {
        if (this.deviceId !== null) {
            await spotify.api.play({ device_id: this.deviceId });
        }
    }

    public async pause(): Promise<void> {
        if (this.deviceId !== null) {
            await spotify.api.pause({ device_id: this.deviceId });
        }
    }

    public async nextTrack(): Promise<void> {
        if (this.deviceId !== null) {
            await spotify.api.skipToNext({ device_id: this.deviceId });
        }
    }

    public async previousTrack(): Promise<void> {
        if (this.deviceId !== null) {
            await spotify.api.skipToPrevious({ device_id: this.deviceId });
        }
    }

    private onStateUpdate = (state: SpotifyApi.CurrentPlaybackResponse): void => {
        const playerState = this.playerState = {
            playback: {
                isPlaying: state.is_playing,
                trackPosition: state.progress_ms || 0
            },
            currentTrack: state.item === null ? null : {
                uri: null,
                id: null,
                name: state.item.name,
                duration: state.item.duration_ms,
                album: {
                    name: state.item.album.name,
                    images: []
                },
                artists: state.item.artists.map(x => ({ name: x.name }))
            },
            nextTracks: [],
            previousTracks: []
        };

        this.eventListenerMap.stateUpdate.forEach(x => x(playerState));
    }
}