import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, withRouter, Redirect } from 'react-router-dom';

import './index.scss';

import { AppState } from 'state';
import { AudioSource, audioSourceService } from 'services/audio';
import AudioPlayer from 'components/AudioPlayer';
import SourceBrowser from './components/source-browser';
import SpotifyConnect from './components/spotify-connect';

export interface Props extends RouteComponentProps<any> {
	isHubConnected: boolean;
	selectedSource: string;
}

export interface State {
	audioSource: AudioSource | null;
}

class AudioView extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			audioSource: null
		}
	}

	public async componentDidMount(): Promise<void> {
		const audioSource = await audioSourceService.setActiveSource(this.props.selectedSource);
		this.setState({ audioSource });
	}

	public render() {
		const { audioSource } = this.state;
		const { url: matchedPath } = this.props.match;

		return (
			<div className="container-fluid">
				<Switch>
					<Route exact path={ matchedPath } render={ props => <AudioPlayer audioSource={ audioSource } { ...props } /> } />
					<Route path={ `${matchedPath}/browse` } render={ props => <SourceBrowser audioSource={ audioSource } { ...props } /> } />
					<Route path={ `${matchedPath}/spotify/connect` } render={ props => <SpotifyConnect isHubConnected={ this.props.isHubConnected } { ...props } /> } />
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = (state: AppState): any => ({
	isHubConnected: state.isHubConnected,
	selectedSource: state.audio.selectedSource
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): any => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AudioView);
