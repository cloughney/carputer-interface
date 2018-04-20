import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, withRouter, Redirect } from 'react-router-dom';

import './index.scss';

import { AppState, AudioState, AudioSourceState } from 'state';
import { selectAudioSource, resetAudioSourceState } from 'state/actions';
import { AudioSource, audioSourceService } from 'services/audio';
import Overlay from 'components/overlay';
import AudioPlayer from './components/audio-player';
import SourceBrowser from './components/source-browser';
import SpotifyConnect from 'components/spotify-connect';

namespace AudioSourceSelector {
	export interface Props extends RouteComponentProps<void> {
		audioState: AudioState;
		setAudioSource(key: string): void;
		resetState(): void;
	}
}

const AudioSourceErrorMessage: React.SFC<{ error: string, exit(): void }> = ({ error, exit }) => (
	<div className="fail">
		<span>Failed to switch audio source:<br />{error}</span><br />
		<button onClick={ exit }>Okay</button>
	</div>
);

const AudioSourceBrowser: React.SFC<AudioSourceSelector.Props> = ({ audioState, setAudioSource, resetState, match, history, location }) => {
	if (audioState.state === AudioSourceState.Initialized) {
		return <Redirect to="/audio/player" />
	}
	
	if (audioState.state === AudioSourceState.RequiresAuthentication && location.state === undefined) {
		return <Redirect to={{
			pathname: `/audio/connect/${audioState.key}`,
			state: { successRedirect: '/audio/player', failureRedirect: match.url }
		}} />;
	}

	let overlayMessage: JSX.Element | null = null;
	switch (audioState.state) {
		case AudioSourceState.Switching:
			overlayMessage = <span>Switching audio sources...</span>;
			break;
		case AudioSourceState.Error:
			overlayMessage = <AudioSourceErrorMessage error={audioState.error} exit={resetState} />;
			break;
	}

	return (
		<div className="sources with-overlay">
			{ audioSourceService.availableSources.map(x => (
				<button key={x.key} onClick={ () => setAudioSource(x.key) }>{x.key}</button>
			)) }
			<Overlay isVisible={ !!overlayMessage }>
				{ overlayMessage }
			</Overlay>
		</div>
	)
}

export interface Props extends RouteComponentProps<any> {
	isHubConnected: boolean;
	audioState: AudioState;
	setAudioSource(source: string): Promise<void>;
	resetState(): void;
}

class AudioView extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render() {
		const { url: matchedPath } = this.props.match;
		const {
			isHubConnected,
			audioState,
			setAudioSource,
			resetState
		} = this.props;

		return (
			<div className="audio">
				<Switch>
					<Route exact path={matchedPath} render={ props => <AudioSourceBrowser {...{ audioState, setAudioSource, resetState, ...props }} /> } />
					<Route path={`${matchedPath}/player`} render={ props => <AudioPlayer audioState={ audioState } { ...props } /> } />
					<Route path={`${matchedPath}/browse`} render={ props => <SourceBrowser audioState={ audioState } { ...props } /> } />
					
					{/* TODO create a 'connect' route that handles auth for audio sources */}
					<Route path={`${matchedPath}/connect/spotify`} render={ props => <SpotifyConnect isHubConnected={ isHubConnected } { ...props } /> } />
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = (state: AppState): any => ({
	isHubConnected: state.isHubConnected,
	audioState: state.audio
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>) => ({
	setAudioSource: (source: string) => dispatch(selectAudioSource(source)),
	clearError: () => dispatch(resetAudioSourceState())
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AudioView);
