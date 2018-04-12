import * as spotify from './spotify';

export interface Album {
    uri: string;
    name: string;
    images: string[];
}

export interface Artist {
    uri: string;
    name: string;
}

export interface Track {
    uri: string;
    id: string | null;
    name: string;
    album: Album;
    artists: Artist[];
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

}

export interface IAudioSource {
    browser: ILibraryBrowser;
    player: IAudioPlayer;
}

const sources: { [key: string]: IAudioSource } = {
    spotify
};

export { sources };