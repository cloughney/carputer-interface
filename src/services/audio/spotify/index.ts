import * as SpotifyWebApi from 'spotify-web-api-js';
import { SpotifyLibraryBrowser } from './spotify-browser';
import { SpotifyPlayer } from './spotify-player';
import { IAudioModule } from '../audio';

let isInitialized = false;

export const api = new SpotifyWebApi();
export const browser = new SpotifyLibraryBrowser();
export const player = new SpotifyPlayer();

export const initialize = async (): Promise<void> => {
    console.log('init');

    if (!isInitialized) {
        try {
            await player.initialize();
            isInitialized = true;
        } catch (err) {
            console.log(err);
            if (err.type === 'authentication') {
                window.location.hash = '#/spotify/connect'; // TODO where should this route live? The path should probably be stored somewhere global.
            }
        }
    }
}

export const dispose = async (): Promise<void> => {
    if (isInitialized) {
        await player.dispose();
        isInitialized = false;
    }
}