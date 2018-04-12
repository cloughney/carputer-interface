import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, withRouter, Redirect } from 'react-router-dom';

import './audio.scss';

import { AppState } from 'state';
import { IAudioSource, sources } from 'services/audio';
import AudioPlayer from 'components/AudioPlayer';
import SourceBrowser from './components/source-browser';
import SpotifyConnect from './components/spotify-connect';

export namespace AudioView {
	export interface Props extends RouteComponentProps<any> {
		isHubConnected: boolean;
		selectedSource: string;
	}

	export interface State { }
}

class AudioView extends React.Component<AudioView.Props> {
	public constructor(props: AudioView.Props) {
		super(props);
	}

	public render() {
		return (
			<div className="container-fluid">
				<Switch>
					<Route exact path={ this.props.match.url } render={ props => <SourceBrowser audioSource={ sources[this.props.selectedSource] } { ...props } /> } />
					<Route path={ `${ this.props.match.url }/spotify/connect` } render={ props => <SpotifyConnect isHubConnected={ this.props.isHubConnected } { ...props } /> } />
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
