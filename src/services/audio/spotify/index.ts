import * as SpotifyWebApi from 'spotify-web-api-js';
import { SpotifyLibraryBrowser } from './spotify-browser';
import { SpotifyPlayer } from './spotify-player';
import { IAudioModule } from '../audio';

let isInitialized = false;

const api = new SpotifyWebApi();
const browser = new SpotifyLibraryBrowser();
const player = new SpotifyPlayer();

const initialize = async (): Promise<void> => {
    if (!isInitialized) {
        try {
            await player.initialize();
            isInitialized = true;
        } catch (err) {
            if (err.status === 401) {
                window.location.hash = '#/spotify/connect'; // TODO where should this route live? The path should probably be stored somewhere global.
                return;
            }

            console.error(err);
            throw new Error('Failed to initialize the Spotify audio source.');
        }
    }
}

const dispose = async (): Promise<void> => {
    if (isInitialized) {
        await player.dispose();
        isInitialized = false;
    }
}

export default { api, browser, player, initialize, dispose };