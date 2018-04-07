import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { SpotifyPlayer } from 'services/audio/spotify-player';

export namespace AudioPlayer {
	export type Props = RouteComponentProps<void> & { };
}

const AudioPlayer: React.SFC<AudioPlayer.Props> = ({ match }) => {
	const accessToken = window.localStorage.getItem('spotify.accessToken');
	const accessTokenExpiration = window.localStorage.getItem('spotify.accessTokenExpiration');
	const isTokenExpired = (accessTokenExpiration !== null && parseInt(accessTokenExpiration) <= new Date().getTime());

	if (accessToken === null || isTokenExpired) {
		return <Redirect to="/audio/spotify/connect" />;
	}

	var player = new SpotifyPlayer();

	return (
		<div>
			<span>Heeeyyyy</span>
		</div>
	);
}

export default withRouter(AudioPlayer);