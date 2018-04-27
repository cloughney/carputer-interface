import { ILibraryBrowser, Category } from '..';
import spotify from '.';

export class StreamLibraryBrowser implements ILibraryBrowser {
    public construct() {

    }

    public async getCategories(): Promise<Category[]> {
        return [];
    }
}
