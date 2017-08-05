import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router-dom';

import { AppState } from 'state';
import { AudioState, AudioSource } from 'state/audio';
import AudioSourceBrowser from './components/AudioSourceBrowser';
import { selectAudioSource } from './actions';

type Props = {
	selectedSource: AudioSource;
	onSourceSelect: (source: AudioSource) => void;
};

type InjectedProps = Props & RouteComponentProps<void>;

const AudioView: React.SFC<InjectedProps> = ({ match, selectedSource, onSourceSelect }) => {
	const redirectPath = `${match.url}/sources`;

	return (
		<div className="container-fluid">
			<Switch>
				<Route exact path={ match.url } render={ () => <Redirect to={ redirectPath } /> } />
				<Route path={ `${match.url}/sources` } render={ props => <AudioSourceBrowser { ...props } selectedSource={ selectedSource } onSourceSelect={ onSourceSelect } /> } />
			</Switch>
		</div>
	);
}

const mapStateToProps = (state: AppState): Partial<Props> => ({
	selectedSource: state.audio.selectedSource
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<Props> => ({
	onSourceSelect: source => {
		dispatch(selectAudioSource(source));
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AudioView);
