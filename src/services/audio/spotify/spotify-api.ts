import * as SpotifyWebApi from 'spotify-web-api-js';
import { client as hub } from 'services/hub';

function isExcludedMember(prop: PropertyKey): boolean {
	return [
		'getAccessToken',
		'setAccessToken',
		'setPromiseImplementation'
	].indexOf(prop as string) !== -1;
}

async function renewAccessToken(): Promise<string | null> {
	try {
		const { accessToken } = await hub.request<{ accessToken: string | null }>('module.spotify.authentication', 'refresh_access_token');
		return accessToken;
	} catch {
		return null;
	}
}

const api = (<any>window)['spotify'] = new Proxy(new SpotifyWebApi(), {
	get: (spotifyApi, prop) => {
		const targetMethod = (<any>spotifyApi)[prop] as (...args: any[]) => any;
		if (isExcludedMember(prop)) {
			return targetMethod;
		}

		return async (...args: any[]): Promise<any> => {
			try {
				return await targetMethod(...args);
			} catch (err) {
				if (err instanceof XMLHttpRequest && err.status === 401) {
					const accessToken = await renewAccessToken();
					if (accessToken === null) {
						throw err;
					}

					spotifyApi.setAccessToken(accessToken);
					return await targetMethod(...args);
				}

				throw err;
			}
		};
	}
});

export { api };
