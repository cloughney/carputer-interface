import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

export namespace SpotifyConnect {
    export type Props = RouteComponentProps<void> & { };
}

const SpotifyConnect: React.SFC<SpotifyConnect.Props> = ({ location }) => {
	let refreshToken = window.localStorage.getItem('spotify.refreshToken');
	if (refreshToken !== null) {
		//TODO refresh token with websocket call
		// wsClient.request('authentication.spotify.refresh', { redirect_uri, scope, refresh_token });
	}

	const responseParams = new URLSearchParams(location.search);
	const accessToken = responseParams.get('access_token');
	const tokenExpiresIn = responseParams.get('expires_in');
	refreshToken = responseParams.get('refresh_token');

	if (accessToken !== null && refreshToken !== null && tokenExpiresIn !== null) {
		window.localStorage.setItem('spotify.accessToken', accessToken);
		window.localStorage.setItem('spotify.refreshToken', refreshToken);

		const expirationWindow = 90; // seconds
		const accessTokenExpiration = (new Date().getTime()) + parseInt(tokenExpiresIn) - expirationWindow;
		window.localStorage.setItem('spotify.accessTokenExpiration', accessTokenExpiration.toString());

		return <Redirect to="/audio" />;
	}

	// TODO if no hash make websocket request
	// wsClient.request('authentication.spotify.authorize', { redirect_uri, scope });
	// this should return { client_id, state }

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