import { IAudioPlayer, AudioPlayerState, Track, AudioPlayerEventListeners as EventListeners, defaultPlayerState, AudioPlayerEventListenerMap } from 'services/audio/audio';

const uninitializedPlayerError = 'The player must be initialized before performing this action.';

export class StreamPlayer implements IAudioPlayer {
    private readonly eventListenerMap: AudioPlayerEventListenerMap;
    private player: HTMLAudioElement | null;
    private playerState: AudioPlayerState;
    private tracks: Track[];

    public constructor() {
		this.eventListenerMap = { 'stateUpdate': [] };

        this.player = null;
		this.playerState = { ...defaultPlayerState };

        this.tracks = [];
    }

    public async initialize(): Promise<void> {
        if (this.player !== null) {
            throw new Error('The player is already initialized.');
        }

        this.player = document.createElement('audio');
		this.player.setAttribute('preload', 'none');

		this.player.onplaying = e => { this.playerState.playback.isPlaying = true; };
		this.player.onpause = e => { this.playerState.playback.isPlaying = false; };
    }

    public async dispose(): Promise<void> {
        if (this.player === null) {
            return;
        }

        this.tracks = [];
        this.playerState = { ...defaultPlayerState };
        this.player = null;
    }

	public addEventListener<T extends keyof EventListeners>(eventName: T, listener: EventListeners[T]): void {
        this.eventListenerMap[eventName].push(listener);

        // if (eventName === 'stateUpdate') {
        //     if (this.eventListenerMap.stateUpdate.length === 1 && this.playbackInterval === null) {
        //         this.playbackInterval = window.setInterval(this.updateState, spotifyStatePollIntervalMs);
        //     }
        // }
    }

    public removeEventListener<T extends keyof EventListeners>(eventName: T, listener: EventListeners[T]): void {
        const listenerIndex = this.eventListenerMap[eventName].indexOf(listener);
        if (listenerIndex === -1) {
            return;
        }
        
        this.eventListenerMap[eventName].splice(listenerIndex, 1);

        // if (eventName === 'stateUpdate' && this.playbackInterval && this.eventListenerMap.stateUpdate.length === 0) {
        //     clearInterval(this.playbackInterval);
        //     this.playbackInterval = null;
        // }
    }

    public async setTracks(tracks: Track[]): Promise<void> {
        this.tracks = tracks;
        this.setActiveTrack(tracks[0]);
    }

    public async getCurrentState(): Promise<AudioPlayerState> {
        return this.playerState;
    }

    public async play(): Promise<void> {
        if (this.player && this.player.src) {
            await this.player.play();
        }
    }

    public async pause(): Promise<void> {
        if (this.player && this.player.src) {
            await this.player.pause();
        }
    }

    public async nextTrack(): Promise<void> { }
	public async previousTrack(): Promise<void> { }
	public async seek(position: number): Promise<void> { }

    private async setActiveTrack(track: Track | undefined): Promise<void> {
        if (this.player === null) {
            throw new Error(uninitializedPlayerError);
        }

        if (track === undefined) {
            this.player.removeAttribute('src');
            return;
        }
        
        this.player.src = this.tracks[0].uri as string;
        this.playerState.currentTrack = track;
    }
}
