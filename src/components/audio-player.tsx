import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { AudioSource, PlaybackState, defaultPlayerState } from 'services/audio';
import Overlay from 'components/overlay';

import './audio-player.scss';

export interface Props {
	audioSource: AudioSource | null;
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
		this.playbackInterval = setInterval(() => {
			
		}, 1000);
	}

	public render() {
		const { audioSource } = this.props;

		return (
			<div className="audio-player with-overlay">
				<button onClick={ this.onPlayClick }>Play!</button>
				<Overlay isVisible={ audioSource === null }>Initializing the audio source</Overlay>
			</div>
		);
	}

	private onPlayClick = async (): Promise<void> => {
		if (this.props.audioSource !== null) {
			this.props.audioSource.player.play();
		}
	}

	private onPauseClick = async (): Promise<void> => {
		if (this.props.audioSource !== null) {
			this.props.audioSource.player.pause();
		}
	}
}