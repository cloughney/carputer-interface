import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router';

import { AppState, AudioState } from 'state';
import { selectAudioSource, resetAudioSourceState } from 'state/actions';
import { audioSourceService } from 'services/audio';
import AudioPlayer from './components/audio-player';
import SourceSelector from './components/source-selector';
import SourceBrowser from './components/source-browser';
import SpotifyConnect from 'components/spotify-connect';

import './index.scss';

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
		const { isHubConnected, audioState, setAudioSource, resetState } = this.props;
		const { url: matchedPath } = this.props.match;

		const playerPath = matchedPath;
		const browserPath = `${matchedPath}/browse`;
		const sourcesPath = `${matchedPath}/sources`;

		return (
			<div className="audio">
				<Switch>
					<Route exact
						path={playerPath}
						render={ props => <AudioPlayer {...{ audioState, browserPath, sourcesPath, ...props }} /> } />
					<Route
						path={browserPath}
						render={ props => <SourceBrowser {...{ audioState, sourcesPath, ...props }} /> } />
					<Route 
						path={sourcesPath}
						render={ props => <SourceSelector {...{audioState, playerPath, setAudioSource, resetState, ...props }} /> } />
					
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
