import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { client } from 'services/hub';

type ErrorHashResponse = { error: string };
type SuccessHashResponse = { accessToken: string; };
type HashResponse = SuccessHashResponse | ErrorHashResponse | null;

interface RefreshTokenResponse {
	accessToken: string | null;
}

interface AuthenticationDetailsResponse {
	endpoint: string;
	clientId: string;
	redirectUrl: string;
	state: string;
}

export namespace SpotifyConnect {
	export type Props = RouteComponentProps<void> & { };
	export type State = {
		isAuthSuccessful: boolean;
	};
}

export default class SpotifyConnect extends React.Component<SpotifyConnect.Props, SpotifyConnect.State> {
	public constructor() {
		super();
		this.state = {
			isAuthSuccessful: false
		};
	}

	public async componentDidMount() {
		// Check for a response from initial authentication.
		const hash = this.getResponseFromHash();
		if (this.isErrorResponse(hash)) {
			return <span>Failed to authenticate with Spotify.</span>;
		} else if (hash !== null) {
			this.setAccessToken(hash.accessToken);
			this.setState({ isAuthSuccessful: true });
			return;
		}

		// Try to refresh an existing token.
		const refreshResponse = await client.request<RefreshTokenResponse>('module.authentication', 'spotify.refresh_access_token');
		if (refreshResponse.accessToken) {
			this.setAccessToken(refreshResponse.accessToken);
			this.setState({ isAuthSuccessful: true });
			return;
		}
		
		// Start the authentication process.
		window.location.assign(`http://h.krik.co:9000/spotify/login?redirect_url=${window.location.href}`);
	}

	public render() {
		if (this.state.isAuthSuccessful) {
			return <Redirect to="/audio" />;
		}
		
		return <span>Awaiting token from hub...</span>;
	}

	private getResponseFromHash(): HashResponse {
		const responseParams = new URLSearchParams(location.search);

		const error = responseParams.get('error');
		if (error) { 
			return { error };
		}
		
		const accessToken = responseParams.get('access_token');

		if (accessToken === null) {
			return null;
		}

		return { accessToken };
	}

	private isErrorResponse(response: HashResponse): response is ErrorHashResponse {
		return !!response && !!(response as ErrorHashResponse).error;
	}

	private setAccessToken(accessToken: string): void {
		// 	// TODO use some centralized service to store this
		window.localStorage.setItem('spotify.accessToken', accessToken);
	}
}