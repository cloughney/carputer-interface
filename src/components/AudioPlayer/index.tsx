import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { api } from 'services/audio/spotify-api';
import { SpotifyPlayer } from 'services/audio/spotify-player';

export namespace AudioPlayer {
	export type Props = RouteComponentProps<void> & { };
}

const AudioPlayer: React.SFC<AudioPlayer.Props> = ({ match }) => {
	const accessToken = api.getAccessToken();
	if (accessToken === null) {
		return <Redirect to="/audio/spotify/connect" />;
	}

	var player = new SpotifyPlayer();
	player.initialize();
	
	api.getMe().then(x => console.dir(x));

	return (
		<div>
			<span>Heeeyyyy</span>
		</div>
	);
}

export default withRouter(AudioPlayer);