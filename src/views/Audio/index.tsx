import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, withRouter, Redirect } from 'react-router-dom';

import './index.scss';

import { AppState } from 'state';
import { selectAudioSource, clearAudioSourceError } from 'state/actions';
import { AudioSource, audioSourceService } from 'services/audio';
import Overlay from 'components/overlay';
import AudioPlayer from 'components/audio-player';
import SourceBrowser from './components/source-browser';

namespace AudioSourceSelector {
	export interface Props {
		isSwitchingSource: boolean;
		sourceError: string | null;
		setAudioSource(key: string): void;
		clearError(): void;
	}
}

const AudioSourceSelector: React.SFC<AudioSourceSelector.Props> = ({ setAudioSource, isSwitchingSource, sourceError, clearError }) => {
	return (
		<div className="sources with-overlay">
			{ audioSourceService.availableSources.map(x => (
				<button key={x.key} onClick={ () => setAudioSource(x.key) }>{x.key}</button>
			)) }
			<Overlay isVisible={isSwitchingSource || !!sourceError}>
				{ isSwitchingSource
					? <span>Switching audio sources...</span>
					: (
						<div className="fail">
							<span>Failed to switch audio source:<br />{sourceError}</span><br />
							<button onClick={ clearError }>Okay</button>
						</div>
					)}
			</Overlay>
		</div>
	)
}

export interface Props extends RouteComponentProps<any> {
	isHubConnected: boolean;
	isSwitchingSource: boolean;
	audioSource: AudioSource | null;
	sourceError: string | null;
	setAudioSource(source: string): Promise<void>;
	clearError(): void;
}

class AudioView extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render() {
		const { audioSource, setAudioSource, isSwitchingSource, sourceError, clearError } = this.props;
		const { url: matchedPath } = this.props.match;

		return (
			<div className="audio">
				<Switch>
					<Route exact path={matchedPath} render={ props => <AudioSourceSelector {...{ setAudioSource, isSwitchingSource, sourceError, clearError }} /> } />
					<Route path={`${matchedPath}/player`} render={ props => <AudioPlayer audioSource={ audioSource } { ...props } /> } />
					<Route path={`${matchedPath}/browse`} render={ props => <SourceBrowser audioSource={ audioSource } { ...props } /> } />		
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = (state: AppState): any => ({
	isHubConnected: state.isHubConnected,
	isSwitchingSource: state.audio.isSwitchingSource,
	audioSource: state.audio.selectedSource,
	sourceError: state.audio.sourceError
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>) => ({
	setAudioSource: (source: string) => dispatch(selectAudioSource(source)),
	clearError: () => dispatch(clearAudioSourceError())
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AudioView);
