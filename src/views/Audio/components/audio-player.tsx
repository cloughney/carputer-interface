import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { AudioState, AudioSourceState } from 'state';
import { AudioSource, AudioPlayerState, Track, defaultPlayerState } from 'services/audio';
import Overlay from 'components/overlay';

import './audio-player.scss';

type PlaybackCommandType = 'play' | 'pause' | 'next' | 'previous';

namespace PlaybackDetails {
	export interface Props {
		currentTrack: Track | null;
		trackPosition: number | null;
		trackDuration: number | null;
	}
}

namespace PlaybackControls {
	export interface Props {
		isPlaying: boolean;
		controlPlayback(command: PlaybackCommandType): void;
	}
}

namespace Menu {
	export interface Props {
		isExpanded: boolean;
	}

	export interface State {
		isExpanded: boolean;
	}
}

const PlaybackDetails: React.SFC<PlaybackDetails.Props> = ({ currentTrack, trackPosition, trackDuration }) => {
	function getPrettyTime(ms: number | null): string {
		if (ms === null) {
			return '0:00';
		}

		let seconds = Math.floor(ms / 1000);
		let minutes = Math.floor(seconds / 60);
		seconds -= minutes * 60;
	
		return `${minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
	}


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
				<div className="time">{ getPrettyTime(trackPosition) }/{ getPrettyTime(trackDuration) }</div>
			</div>
		</div>
	)
}

const PlaybackControls: React.SFC<PlaybackControls.Props> = ({ isPlaying, controlPlayback }) => {
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

class Menu extends React.Component<Menu.Props, Menu.State> {
	public constructor(props: Menu.Props) {
		super(props);
		this.state = { isExpanded: props.isExpanded };
	}

	public render() {
		const { isExpanded } = this.state;
		return (
			<div className={`menu ${ isExpanded ? 'out': 'in' }`}>
				<button className="sources" onClick={() => { }} />
				<button className="browser" onClick={() => { }} />
				<button className="hint" onClick={() => this.setState(x => ({ isExpanded: !x.isExpanded }))} />
			</div>
		);
	}
}

export interface Props extends RouteComponentProps<void> {
	audioState: AudioState;
	browserPath: string;
	sourcesPath: string;
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
		const { audioState } = this.props;
		if (audioState.state !== AudioSourceState.Initialized) {
			return;
		}
		
		const { source } = audioState;
		const playerState = await source.player.getCurrentState();
		this.onStateUpdate(playerState);

		source.player.addEventListener('stateUpdate', this.onStateUpdate);
		this.playbackInterval = window.setInterval(() => this.onPlaybackTick(source), 1000);
	}

	public componentWillUnmount(): void {
		if (this.playbackInterval) {
			clearInterval(this.playbackInterval);
		}

		const { audioState } = this.props;
		if (audioState.state === AudioSourceState.Initialized) {
			audioState.source.player.removeEventListener('stateUpdate', this.onStateUpdate);
		}
	}

	public render() {
		const { audioState, sourcesPath } = this.props;
		if (audioState.state !== AudioSourceState.Initialized) {
			return <Redirect to={sourcesPath} />;
		}

		const { isPlaying, currentTrack, trackPosition, trackDuration } = this.state;
		const backgroundImage = currentTrack !== null ? `url('${currentTrack.album.image}')` : null;

		return (
			<div className="audio-player">
				<div className="cover-art" style={{ backgroundImage }} />
				<div className="player">
					<PlaybackDetails currentTrack={currentTrack} trackPosition={trackPosition} trackDuration={trackDuration} />
					<PlaybackControls isPlaying={isPlaying} controlPlayback={ command => this.onPlayerControlClick(audioState.source, command) } />
				</div>
				<Menu isExpanded={false} />
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
