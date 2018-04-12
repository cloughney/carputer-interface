import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import './audio.scss';

import { AppState } from 'state';
import AudioPlayer from 'components/AudioPlayer';
import SpotifyConnect from './components/SpotifyConnect';

export namespace AudioView {
	export type Props = RouteComponentProps<void> & {
		isHubConnected: boolean;
	};
}

const AudioView: React.SFC<AudioView.Props> = ({ match, isHubConnected }) => {
	return (
		<div className="container-fluid">
			<Switch>
				<Route exact path={ match.url } component={ AudioPlayer } />
				<Route path={ `${match.url}/spotify/connect/:search?` } render={ props => <SpotifyConnect isHubConnected={ isHubConnected } { ...props } /> } />
			</Switch>
		</div>
	);
}

const mapStateToProps = (state: AppState) => ({ isHubConnected: state.isHubConnected });
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(AudioView));
