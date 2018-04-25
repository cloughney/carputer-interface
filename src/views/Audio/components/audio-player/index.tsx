import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { AudioState, AudioSourceState } from 'state';
import { AudioSource, AudioPlayerState, RepeatState, Track } from 'services/audio';
import PlaybackControls from './controls';
import PlaybackDetails from './details';
import Menu from './menu';

import './index.scss';

export interface Props extends RouteComponentProps<void> {
	audioState: AudioState;
	browserPath: string;
	sourcesPath: string;
}

export interface State {
	isPlaying: boolean;
	shuffleState: boolean;
	repeatState: RepeatState;
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
			shuffleState: false,
			repeatState: RepeatState.Off,
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
		const { audioState, browserPath, history, sourcesPath } = this.props;
		if (audioState.state !== AudioSourceState.Initialized) {
			return <Redirect to={sourcesPath} />;
		}

		const { isPlaying, shuffleState, repeatState, currentTrack, trackPosition, trackDuration } = this.state;
		const backgroundImage = currentTrack !== null ? `url('${currentTrack.album.image}')` : null;

		return (
			<div className="audio-player">
				<div className="cover-art" style={{ backgroundImage }} />
				<div className="player">
					<PlaybackDetails currentTrack={currentTrack} />
					<PlaybackControls isPlaying={isPlaying} trackPosition={trackPosition} trackDuration={trackDuration} controls={{
						play: () => this.play(audioState.source),
						pause: () => this.pause(audioState.source),
						next: () => this.next(audioState.source),
						previous: () => this.previous(audioState.source),
						seek: position => this.seek(audioState.source, position)
					}} />
				</div>
				<Menu side="left" isExpanded={false}>
					<button className="sources" onClick={() => history.push(sourcesPath)} />
					<button className="browser" onClick={() => history.push(browserPath)} />
				</Menu>
				<Menu side="right" isExpanded={false}>
					<button className={ `shuffle ${ shuffleState ? 'on' : null }` } onClick={() => {}} />
					<button className={ `repeat ${ repeatState !== RepeatState.Off ? 'on' : null }` } onClick={() => {}} />
				</Menu>
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
			shuffleState: state.playback.shuffleState,
			repeatState: state.playback.repeatState,
			currentTrack: state.currentTrack,
			trackPosition: state.playback.trackPosition,
			trackDuration: state.currentTrack !== null ? state.currentTrack.duration : null
		});
	}

	private play = async (audioSource: AudioSource): Promise<void> => {
		await audioSource.player.play();
		this.setState({ isPlaying: true });
	}

	private pause = async (audioSource: AudioSource): Promise<void> => {
		await audioSource.player.pause();
		this.setState({ isPlaying: false });
	}

	private next = async (audioSource: AudioSource): Promise<void> => {
		await audioSource.player.nextTrack();
		window.setTimeout(async () =>
			this.onStateUpdate(await audioSource.player.getCurrentState()), 1000);
	}

	private previous = async (audioSource: AudioSource): Promise<void> => {
		await audioSource.player.previousTrack();
		window.setTimeout(async () =>
			this.onStateUpdate(await audioSource.player.getCurrentState()), 1000);
	}

	private seek = async (audioSource: AudioSource, position: number): Promise<void> => {
		await audioSource.player.seek(position);
		this.setState({ trackPosition: position });
	}

	private toggleShuffle = async (audioSource: AudioSource): Promise<void> => {
		
	}
	
	private toggleRepeat = async (audioSource: AudioSource): Promise<void> => {
		
	}
}
