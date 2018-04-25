export interface Album {
    name: string;
    image: string;
}

export interface Artist {
    name: string;
}

export interface Track {
    uri: string | null;
    id: string | null;
    name: string;
    album: Album;
    artists: Artist[];
    duration: number;
}

export interface Category {
    id: string;
    name: string;
    image: string;
}

export enum RepeatState {
	Off = 'off',
	Track = 'track',
	Context = 'context'
}

export interface PlaybackState {
	isPlaying: boolean;
	shuffleState: boolean;
	repeatState: RepeatState;
    trackPosition: number;
}

export interface AudioPlayerState {
    playback: PlaybackState;
    currentTrack: Track | null;
}

export interface AudioPlayerEventListeners { 'stateUpdate': (state: AudioPlayerState) => void; }
export type AudioPlayerEventListenerMap = { [P in keyof AudioPlayerEventListeners]: AudioPlayerEventListeners[P][] };

export interface IAudioPlayer {
    initialize(): Promise<void>;
    dispose(): Promise<void>;

    addEventListener<T extends keyof AudioPlayerEventListeners>(eventName: T, listener: AudioPlayerEventListeners[T]): void;
    removeEventListener<T extends keyof AudioPlayerEventListeners>(eventName: T, listener: AudioPlayerEventListeners[T]): void;

    getCurrentState(): Promise<AudioPlayerState>;

    setTracks(tracks: Track[]): Promise<void>;

    play(): Promise<void>;
    pause(): Promise<void>;
    nextTrack(): Promise<void>;
	previousTrack(): Promise<void>;
	seek(position: number): Promise<void>;
}

export interface ILibraryBrowser {
    getCategories(): Promise<Category[]>;
}

export interface AudioModule {
    browser: ILibraryBrowser;
    player: IAudioPlayer;
    initialize(): Promise<void>;
    dispose(): Promise<void>;
}

export interface AudioSource {
    key: string;
    browser: ILibraryBrowser;
    player: IAudioPlayer;
}

export const defaultPlayerState: AudioPlayerState = {
    playback: {
		isPlaying: false,
		shuffleState: false,
		repeatState: RepeatState.Off,
        trackPosition: 0
    },
    currentTrack: null
};
