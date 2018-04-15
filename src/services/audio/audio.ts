export interface Album {
    name: string;
    images: string[];
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

export interface PlaybackState {
    isPlaying: boolean;
    trackPosition: number;
}

export interface AudioPlayerState {
    playback: PlaybackState;
    currentTrack: Track | null;
    previousTracks: Track[];
    nextTracks: Track[];
}

export interface IAudioPlayer {
    initialize(): Promise<void>;
    dispose(): Promise<void>;

    setTracks(tracks: Track[]): Promise<void>;

    play(): Promise<void>;
    pause(): Promise<void>;
    nextTrack(): Promise<void>;
    previousTrack(): Promise<void>;
}

export interface ILibraryBrowser {
    getCategories(): Promise<Category[]>;
}

export interface IAudioModule {
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