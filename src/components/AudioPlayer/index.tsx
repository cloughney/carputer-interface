import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { SpotifyPlayer } from 'services/audio/spotify-player';

export namespace AudioPlayer {
	export type Props = RouteComponentProps<void> & { };
}

const AudioPlayer: React.SFC<AudioPlayer.Props> = ({ match }) => {
	const accessToken = window.localStorage.getItem('spotify.accessToken');
	if (accessToken === null) {
		return <Redirect to="/audio/spotify/connect" />;
	}

	var player = new SpotifyPlayer();
	player.initialize();
	

	return (
		<div>
			<span>Heeeyyyy</span>
		</div>
	);
}

export default withRouter(AudioPlayer);