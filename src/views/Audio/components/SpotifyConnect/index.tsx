import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { client } from 'services/hub';

export namespace SpotifyConnect {
    export type Props = RouteComponentProps<void> & { };
}

const SpotifyConnect: React.SFC<SpotifyConnect.Props> = ({ location }) => {
	// First, check if this is a successful authentication reply.
	const responseParams = new URLSearchParams(location.search);
	const accessToken = responseParams.get('access_token');
	const tokenExpiresIn = responseParams.get('expires_in');
	let refreshToken = responseParams.get('refresh_token');

	if (accessToken !== null && refreshToken !== null && tokenExpiresIn !== null) {
		window.localStorage.setItem('spotify.accessToken', accessToken);
		window.localStorage.setItem('spotify.refreshToken', refreshToken);

		const expirationWindow = 90; // seconds
		const accessTokenExpiration = (new Date().getTime()) + parseInt(tokenExpiresIn) - expirationWindow;
		window.localStorage.setItem('spotify.accessTokenExpiration', accessTokenExpiration.toString());

		return <Redirect to="/audio" />;
	}

	// Then check if we have a refresh token.
	refreshToken = window.localStorage.getItem('spotify.refreshToken');
	if (refreshToken !== null) {
		//TODO refresh token with websocket call		
		//const response = await client.request('oauth_module', 'spotify.authentication.refresh_access_token', { refreshToken });
		
	}

	// TODO if no hash make websocket request
	// wsClient.request('authentication.spotify.authorize', { scope });
	// this should return { client_id, state, redirect_uri }

	const params: { [key: string]: string } = {
		'response_type': 'code',
        'redirect_uri': 'http://h.krik.co:9000/spotify/callback',
        'client_id': '',
		//'scope': '',
		//'state': 'jibberish'
	};

	const queryParams: string[] = [];
	Object.getOwnPropertyNames(params).forEach(x => {
		queryParams.push(`${x}=${encodeURIComponent(params[x])}`);
	});

	window.location.assign(`https://accounts.spotify.com/authorize?${queryParams.join('&')}`);

	return null; //this will never be hit, better way to do this?
}

export default withRouter(SpotifyConnect);