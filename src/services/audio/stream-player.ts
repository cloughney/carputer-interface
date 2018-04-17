import { IAudioPlayer, Track, AudioPlayerEventListeners as EventListeners } from '.';

const uninitializedPlayerError = 'The player must be initialized before performing this action.';

const initialPlayerState = {
    isPlaying: false,
    currentTrack: null
};

interface PlayerState {
    isPlaying: boolean;
    currentTrack: Track | null;
}

export class StreamPlayer implements IAudioPlayer {
    private player: HTMLAudioElement | null;
    private playerState: PlayerState;
    private tracks: Track[];

    public constructor() {
        this.player = null;
        this.playerState = initialPlayerState;

        this.tracks = [];
    }

    public initialize(): Promise<void> {
        if (this.player !== null) {
            throw new Error('The player is already initialized.');
        }

        return new Promise((resolve, reject) => {
            this.player = document.createElement('audio');
            this.player.setAttribute('preload', 'none');

            this.player.onplaying = e => { this.playerState.isPlaying = true; };
            this.player.onpause = e => { this.playerState.isPlaying = false; };

            //TODO setup more events
        });
    }

    public async dispose(): Promise<void> {
        if (this.player === null) {
            return;
        }

        this.tracks = [];
        this.playerState = initialPlayerState;
        this.player = null;
    }

    public addEventListener<T extends keyof EventListeners>(eventName: T, listener: EventListeners[T]): void {
        throw new Error('Not implemented');
    }

    public removeEventListener<T extends keyof EventListeners>(eventName: T, listener: EventListeners[T]): void {
        throw new Error('Not implemented');
    }

    public async setTracks(tracks: Track[]): Promise<void> {
        this.tracks = tracks;
        this.setActiveTrack(tracks[0]);
    }

    public async play(): Promise<void> {
        if (this.player === null) {
            throw new Error(uninitializedPlayerError);
        }

        await this.player.play();
    }

    public async pause(): Promise<void> {
        if (this.player === null) {
            throw new Error(uninitializedPlayerError);
        }

        await this.player.pause();
    }

    public async nextTrack(): Promise<void> { }
    public async previousTrack(): Promise<void> { }

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