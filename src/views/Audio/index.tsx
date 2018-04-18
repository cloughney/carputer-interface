import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, withRouter, Redirect } from 'react-router-dom';

import './index.scss';

import { AppState } from 'state';
import { selectAudioSource } from 'state/actions';
import { AudioSource, audioSourceService } from 'services/audio';
import Overlay from 'components/overlay';
import AudioPlayer from 'components/audio-player';
import SourceBrowser from './components/source-browser';

export interface Props extends RouteComponentProps<any> {
	isHubConnected: boolean;
	isSwitchingSource: boolean;
	selectedSource: AudioSource | null;
	sourceError: string | null;
	selectAudioSource(source: string): Promise<void>;
}

class AudioView extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render() {
		const { selectedSource, isSwitchingSource, sourceError } = this.props;
		const { url: matchedPath } = this.props.match;

		if (selectedSource === null) {
			return (
				<div className="audio with-overlay">
					{ audioSourceService.availableSources.map(x => (
						<button key={x.key} onClick={ () => this.props.selectAudioSource(x.key) }>{x.key}</button>
					)) }
					<Overlay isVisible={isSwitchingSource || !!sourceError}>
						{ isSwitchingSource
							? <span>Switching audio source...</span>
							: <span>Failed to switch audio source:<br />{sourceError}</span> }
					</Overlay>
				</div>
			);
		} 

		return (
			<div className="audio">
				<Switch>
					<Route exact path={ matchedPath } render={ props => <AudioPlayer audioSource={ selectedSource } { ...props } /> } />
					<Route path={ `${matchedPath}/browse` } render={ props => <SourceBrowser audioSource={ selectedSource } { ...props } /> } />
				</Switch>
			</div>
		);
	}

	private onAudioSourceSelected = async (key: string): Promise<void> => {
		this.props.selectAudioSource(key);
	}
}

const mapStateToProps = (state: AppState): any => ({
	isHubConnected: state.isHubConnected,
	isSwitchingSource: state.audio.isSwitchingSource,
	selectedSource: state.audio.selectedSource,
	sourceError: state.audio.sourceError
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>) => ({
	selectAudioSource: (source: string) => dispatch(selectAudioSource(source))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AudioView);
