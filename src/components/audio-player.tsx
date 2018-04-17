import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { AudioSource, AudioPlayerState, defaultPlayerState } from 'services/audio';
import Overlay from 'components/overlay';

import './audio-player.scss';

export interface Props {
	audioSource: AudioSource;
}

export interface State {
	playerState: AudioPlayerState;
}

export default class AudioPlayer extends React.Component<Props, State> {
	private playbackInterval: number | null;

	public constructor(props: Props) {
		super(props);

		this.state = {
			playerState: defaultPlayerState
		};

		this.playbackInterval = null;
	}

	public componentDidMount(): void {
		this.props.audioSource.player.addEventListener('stateUpdate', this.onStateUpdate);
		// this.playbackInterval = setInterval(() => {
			
		// }, 1000);
	}

	public componentWillUnmount(): void {
		this.props.audioSource.player.removeEventListener('stateUpdate', this.onStateUpdate);
	}

	public render() {
		const { audioSource } = this.props;
		const { playerState } = this.state;

		return (
			<div className="audio-player">
				{ playerState.currentTrack !== null ?
					<div>
						<div>{  playerState.currentTrack.name }</div>
						<div>{ playerState.playback.trackPosition }/{ playerState.currentTrack.duration }</div>
					</div>
				: null }

				<button onClick={ audioSource.player.play.bind(audioSource.player) }>Play</button>
				<button onClick={ audioSource.player.pause.bind(audioSource.player) }>Pause</button>
				<button onClick={ audioSource.player.previousTrack.bind(audioSource.player) }>Previous</button>
				<button onClick={ audioSource.player.nextTrack.bind(audioSource.player) }>Next</button>
			</div>
		);
	}

	private onStateUpdate = (state: AudioPlayerState): void => {
		this.setState({ playerState: state });
	}
}