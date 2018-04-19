import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { AudioSource, AudioPlayerState, Track, defaultPlayerState } from 'services/audio';
import Overlay from 'components/overlay';

import './audio-player.scss';

type PlaybackCommandType = 'play' | 'pause' | 'next' | 'previous';

interface PlaybackProps {
	currentTrack: Track | null;
	trackPosition: number | null;
	trackDuration: number | null;
}

interface ControlProps {
	isPlaying: boolean;
	controlPlayback(command: PlaybackCommandType): void;
}

const PlaybackDetails: React.SFC<PlaybackProps> = ({ currentTrack, trackPosition, trackDuration }) => {
	function getPrettyTime(ms: number | null): string {
		if (ms === null) {
			return '0:00';
		}

		let seconds = Math.floor(ms / 1000);
		let minutes = Math.floor(seconds / 60);
		seconds -= minutes * 60;
	
		return `${minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
	}

	if (currentTrack === null) {
		return null;
	}

	return (
		<div className="details">
			<div className="album-art"><img src={currentTrack.album.image} /></div>
			<div className="playback">
				<div className="title">{ currentTrack.name }</div>
				<div className="artist">{ currentTrack.artists.map(x => x.name).join(', ') }</div>
				<div className="album">{ currentTrack.album.name }</div>
				<div className="time">{ getPrettyTime(trackPosition) }/{ getPrettyTime(trackDuration) }</div>
			</div>
		</div>
	)
}

const PlaybackControls: React.SFC<ControlProps> = ({ isPlaying, controlPlayback }) => {
	const togglePlayButton = isPlaying
		? <button className="pause" onClick={ () => controlPlayback('pause') } />
		: <button className="play" onClick={ () => controlPlayback('play') } />;

	return (
		<div className="controls">
			<button className="previous" onClick={ () => controlPlayback('previous') } />
			{ togglePlayButton }
			<button className="next" onClick={ () => controlPlayback('next') } />
		</div>
	)
}

export interface Props {
	audioSource: AudioSource | null;
}

export interface State {
	isPlaying: boolean;
	currentTrack: Track | null;
	trackPosition: number | null;
	trackDuration: number | null;
}

export default class AudioPlayer extends React.Component<Props, State> {
	private playbackInterval: number | null;

	public constructor(props: Props) {
		super(props);

		this.state = {
			isPlaying: false,
			currentTrack: null,
			trackPosition: null,
			trackDuration: null
		};

		this.playbackInterval = null;
	}

	public async componentDidMount(): Promise<void> {
		const { audioSource } = this.props;
		if (audioSource === null) {
			return;
		}
		
		const playerState = await audioSource.player.getCurrentState();
		this.onStateUpdate(playerState);

		audioSource.player.addEventListener('stateUpdate', this.onStateUpdate);
		this.playbackInterval = window.setInterval(() => this.onPlaybackTick(audioSource), 1000);
	}

	public componentWillUnmount(): void {
		if (this.playbackInterval) {
			clearInterval(this.playbackInterval);
		}

		if (this.props.audioSource) {
			this.props.audioSource.player.removeEventListener('stateUpdate', this.onStateUpdate);
		}
	}

	public render() {
		const { audioSource } = this.props;
		if (audioSource === null) {
			return <Redirect to={'/audio'} />;
		}

		const { isPlaying, currentTrack, trackPosition, trackDuration } = this.state;
		const backgroundImage = currentTrack !== null ? `url('${currentTrack.album.image}')` : null;

		return (
			<div className="audio-player">
				<div className="cover-art" style={{ backgroundImage }} />
				<div className="player">
					<PlaybackDetails currentTrack={currentTrack} trackPosition={trackPosition} trackDuration={trackDuration} />
					<PlaybackControls isPlaying={isPlaying} controlPlayback={ command => this.onPlayerControlClick(audioSource, command) } />
				</div>
			</div>
		);
	}

	private onPlaybackTick = (audioSource: AudioSource): void => {
		this.setState(state => {
			if (!state.isPlaying || state.trackPosition === null || state.trackDuration === null) {
				return state;
			}

			const msUntilEnd = state.trackDuration - state.trackPosition;
			if (msUntilEnd < 1000) {
				window.setTimeout(async () => {
					const playerState = await audioSource.player.getCurrentState();
					this.onStateUpdate(playerState);
				}, msUntilEnd + 500);

				return state;
			}

			return { ...state, trackPosition: state.trackPosition + 1000 };
		});
	}

	private onStateUpdate = (state: AudioPlayerState): void => {
		this.setState({
			isPlaying: state.playback.isPlaying,
			currentTrack: state.currentTrack,
			trackPosition: state.playback.trackPosition,
			trackDuration: state.currentTrack !== null ? state.currentTrack.duration : null
		});
	}

	//TODO add shuffle/repeat
	private onPlayerControlClick = async (audioSource: AudioSource, command: PlaybackCommandType): Promise<void> => {
		const { player } = audioSource;

		switch (command) {
			case 'play':
				await player.play();
				this.setState({ isPlaying: true });
				break;
			case 'pause':
				await player.pause();
				this.setState({ isPlaying: false });
				break;
			case 'next':
				await player.nextTrack();
				window.setTimeout(async () => this.onStateUpdate(await player.getCurrentState()), 1000);
				break;
			case 'previous':
				await player.previousTrack();
				window.setTimeout(async () => this.onStateUpdate(await player.getCurrentState()), 1000);
				break;
		}
	}
}
