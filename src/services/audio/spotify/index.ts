import * as SpotifyWebApi from 'spotify-web-api-js';
import { SpotifyLibraryBrowser } from './spotify-browser';
import { SpotifyPlayer } from './spotify-player';
import { IAudioModule } from '../audio';

let isInitialized = false;

export const api = new SpotifyWebApi();
export const browser = new SpotifyLibraryBrowser();
export const player = new SpotifyPlayer();

export const initialize = async (): Promise<void> => {
    if (!isInitialized) {
        await player.initialize();
        isInitialized = true;
    }
}

export const dispose = async (): Promise<void> => {
    if (isInitialized) {
        await player.dispose();
        isInitialized = false;
    }
}