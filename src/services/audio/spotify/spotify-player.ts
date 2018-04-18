import { client as hub } from 'services/hub';
import { IAudioPlayer, AudioPlayerState, AudioPlayerEventListeners as EventListeners, AudioPlayerEventListenerMap, Track, defaultPlayerState } from '..';
import spotify from '.';

const spotifyStatePollIntervalMs = 5000;

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

        if (this.eventListenerMap.stateUpdate.length > 0) {
            this.playbackInterval = setInterval(this.updateState, spotifyStatePollIntervalMs);
        }
    }

    public async dispose(): Promise<void> {
        if (this.deviceId === null || this.playbackInterval === null) {
            return;
        }

        clearInterval(this.playbackInterval);
        this.playbackInterval = null;

        Object.getOwnPropertyNames(this.eventListenerMap).forEach(x => {
            this.eventListenerMap[x as keyof EventListeners] = [];
        });

        this.playerState = null;
        this.deviceId = null;
    }

    public addEventListener<T extends keyof EventListeners>(eventName: T, listener: EventListeners[T]): void {
        this.eventListenerMap[eventName].push(listener);

        if (eventName === 'stateUpdate') {
            if (this.eventListenerMap.stateUpdate.length === 1 && this.playbackInterval === null) {
                this.playbackInterval = setInterval(this.updateState, spotifyStatePollIntervalMs);
            }
        }
    }

    public removeEventListener<T extends keyof EventListeners>(eventName: T, listener: EventListeners[T]): void {
        const listenerIndex = this.eventListenerMap[eventName].indexOf(listener);
        if (listenerIndex === -1) {
            return;
        }
        
        this.eventListenerMap[eventName].splice(listenerIndex, 1);

        if (eventName === 'stateUpdate' && this.playbackInterval && this.eventListenerMap.stateUpdate.length === 0) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
    }

    public async getCurrentState(): Promise<AudioPlayerState> {
        await this.updateState(false);
        return this.playerState as AudioPlayerState;
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

    private updateState = async (notify: boolean = true): Promise<void> => {
        const spotifyState = await spotify.api.getMyCurrentPlaybackState();
        
        const playerState = this.playerState = {
            playback: {
                isPlaying: spotifyState.is_playing,
                trackPosition: spotifyState.progress_ms || 0
            },
            currentTrack: spotifyState.item === null ? null : {
                uri: null,
                id: null,
                name: spotifyState.item.name,
                duration: spotifyState.item.duration_ms,
                album: {
                    name: spotifyState.item.album.name,
                    image: spotifyState.item.album.images.length > 0 ? spotifyState.item.album.images[0].url : ''
                },
                artists: spotifyState.item.artists.map(x => ({ name: x.name }))
            }
        };

        if (notify) {
            this.eventListenerMap.stateUpdate.forEach(x => x(playerState));
        }
    }
}