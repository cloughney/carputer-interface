import * as SpotifyWebApi from 'spotify-web-api-js';
import { SpotifyLibraryBrowser } from './spotify-browser';
import { SpotifyPlayer } from './spotify-player';

export const api = new SpotifyWebApi();
export const browser = new SpotifyLibraryBrowser();
export const player = new SpotifyPlayer();