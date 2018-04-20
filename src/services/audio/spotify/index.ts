import * as SpotifyWebApi from 'spotify-web-api-js';
import { SpotifyLibraryBrowser } from './spotify-browser';
import { SpotifyPlayer } from './spotify-player';
import { AudioModule } from '../audio';

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
            if (err instanceof XMLHttpRequest && err.status === 401) {
                throw { type: 'authentication' };
            }

            throw err;
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
