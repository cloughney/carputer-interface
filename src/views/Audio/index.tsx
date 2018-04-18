import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, withRouter, Redirect } from 'react-router-dom';

import './index.scss';

import { AppState } from 'state';
import { AudioSource, audioSourceService } from 'services/audio';
import AudioPlayer from 'components/audio-player';
import SourceBrowser from './components/source-browser';

export interface Props extends RouteComponentProps<any> {
	isHubConnected: boolean;
	selectedSource: AudioSource;
	selectAudioSource(source: AudioSource): void;
}

class AudioView extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render() {
		const { selectedSource } = this.props;
		const { url: matchedPath } = this.props.match;

		if (selectedSource === null) {
			return (
				<div className="audio">
					{ audioSourceService.availableSources.map(x => (
						<button key={x.key} onClick={ () => this.onAudioSourceSelected(x.key) }>{x.key}</button>
					)) }
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
		try {
			const audioSource = await audioSourceService.setActiveSource(key);
			this.props.selectAudioSource(audioSource);
		} catch (err) {
			if (err.type === 'authentication') {
				this.props.history.push(err.route);
				return;
			}

			throw err;
		}
	}
}

const mapStateToProps = (state: AppState): any => ({
	isHubConnected: state.isHubConnected,
	selectedSource: state.audio.selectedSource
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
	selectAudioSource: (source: AudioSource) => { dispatch({ type: 'AUDIO_SOURCE_SELECTED', source }); }
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AudioView);
