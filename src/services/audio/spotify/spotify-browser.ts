import { ILibraryBrowser, Category, Track, Album, Artist } from '..';
import { api } from '.';

export class SpotifyLibraryBrowser implements ILibraryBrowser {
    public construct() {

    }

    public async getCategories(): Promise<Category[]> {
        const response = await api.getUserPlaylists();
        return response.items.map(x => ({
            id: x.id,
            name: x.name,
            image: x.images[0].url
        }));
    }
}