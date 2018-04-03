import * as React from 'react';

export const spotify: IAudioPlayerSource = {
	isAvailable: true,
	async getPlaylists(): Promise<any[]> {
		return [];
	}
}

const AudioPlayer: React.SFC = props => {
	return (<div />);
}