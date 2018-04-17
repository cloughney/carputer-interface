import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { AudioSource, PlaybackState, defaultPlayerState } from 'services/audio';
import Overlay from 'components/overlay';

import './audio-player.scss';

export interface Props {
	audioSource: AudioSource;
}

export interface State {
	playback: PlaybackState;
}

export default class AudioPlayer extends React.Component<Props> {
	private playbackInterval: number | null;

	public constructor(props: Props) {
		super(props);

		this.state = {
			playback: defaultPlayerState.playback
		};

		this.playbackInterval = null;
	}

	public componentDidMount(): void {
		// this.playbackInterval = setInterval(() => {
			
		// }, 1000);
	}

	public render() {
		const { audioSource } = this.props;

		return (
			<div className="audio-player with-overlay">
				<button onClick={ audioSource.player.play.bind(audioSource.player) }>Play</button>
				<button onClick={ audioSource.player.pause.bind(audioSource.player) }>Pause</button>
				<button onClick={ audioSource.player.previousTrack.bind(audioSource.player) }>Previous</button>
				<button onClick={ audioSource.player.nextTrack.bind(audioSource.player) }>Next</button>
			</div>
		);
	}
}