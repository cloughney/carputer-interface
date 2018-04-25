import * as React from 'react';
import { Track } from 'services/audio';

export interface Props {
	currentTrack: Track | null;
}

const PlaybackDetails: React.SFC<Props> = ({ currentTrack }) => {
	const trackTitle = currentTrack ? currentTrack.name : '--';
	const trackArtists = currentTrack ? currentTrack.artists.map(x => x.name).join(', ') : '--';
	const albumTitle = currentTrack ? currentTrack.album.name : '--';
	const albumImageSrc = currentTrack ? currentTrack.album.image : '';

	return (
		<div className="details">
			<div className="album-art"><img src={albumImageSrc} /></div>
			<div className="playback">
				<div className="title">{ trackTitle }</div>
				<div className="artist">{ trackArtists }</div>
				<div className="album">{ albumTitle }</div>
			</div>
		</div>
	)
}

export default PlaybackDetails;
