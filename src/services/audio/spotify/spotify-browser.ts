import { ILibraryBrowser, Category, Track, Album, Artist } from '..';
import spotify from '.';

export class SpotifyLibraryBrowser implements ILibraryBrowser {
    public construct() {

    }

    public async getCategories(): Promise<Category[]> {
        const response = await spotify.api.getUserPlaylists();
        return response.items.map(x => ({
            id: x.id,
            name: x.name,
            image: x.images[0].url
        }));
    }
}