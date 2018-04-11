import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { client } from 'services/hub';
import { api } from 'services/audio/spotify-api';

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

enum AuthState {
	AwaitingHubConnection,
	AwaitingToken,
	Authenticated,
	Error
}

export namespace SpotifyConnect {
	export type Props = {
		isHubConnected: boolean;
	};

	export type State = {
		authState: AuthState;
	};
}

export default class SpotifyConnect extends React.Component<SpotifyConnect.Props, SpotifyConnect.State> {
	public constructor(props: SpotifyConnect.Props) {
		super(props);
		this.state = {
			authState: props.isHubConnected ? AuthState.AwaitingToken : AuthState.AwaitingHubConnection
		};
	}

	public componentDidMount(): void {
		const accessToken = api.getAccessToken();
		if (accessToken) {
			this.setState({ authState: AuthState.Authenticated });
			return;
		}

		// Check for a response from initial authentication.
		const hash = this.getResponseFromQuery();
		if (this.isErrorResponse(hash)) {
			this.setState({ authState: AuthState.Error });
			return;
		} else if (hash !== null) {
			this.setAccessToken(hash.accessToken);
			this.setState({ authState: AuthState.Authenticated });
			return;
		}

		if (!this.props.isHubConnected) {
			this.setState({ authState: AuthState.AwaitingHubConnection });
			return;
		}

		this.getAccessToken();
	}

	public componentWillReceiveProps(props: SpotifyConnect.Props): void {
		if (this.state.authState === AuthState.AwaitingHubConnection && props.isHubConnected) {
			this.getAccessToken();
		}
	}

	public render() {
		switch (this.state.authState) {
			case AuthState.Authenticated:
				return <Redirect to="/audio" />;
			case AuthState.AwaitingHubConnection:
				return <span>Awaiting connection with hub...</span>;
			case AuthState.AwaitingToken:
				return <span>Awaiting token from hub...</span>;
			default:
				return <span>Encountered an error while authenticating with Spotify.</span>;
		}
	}

	private getResponseFromQuery(): HashResponse {
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

	private async getAccessToken(): Promise<void> {
		// Try to refresh an existing token.
		const refreshResponse = await client.request<RefreshTokenResponse>('module.authentication', 'spotify.refresh_access_token');
		if (refreshResponse.accessToken) {
			this.setAccessToken(refreshResponse.accessToken);
			this.setState({ authState: AuthState.Authenticated });
			return;
		}
		
		// Start the authentication process.
		window.location.assign(`http://h.krik.co:9000/spotify/login?redirect_url=${window.location.href}`);
	}

	private setAccessToken(accessToken: string): void {
		api.setAccessToken(accessToken);
	}
}