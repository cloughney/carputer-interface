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
		if (this.props.selectedSource === null) {
			return;
		}

		try {
			const audioSource = await audioSourceService.setActiveSource(this.props.selectedSource);
			this.setState({ audioSource });
		} catch (err) {
			// TODO display a quick message
		}
	}

	public render() {
		const { audioSource } = this.state;
		const { url: matchedPath } = this.props.match;

		if (audioSource === null) {
			return (
				<div>
					{ audioSourceService.availableSources.map(x => (
						<button key={x.key} onClick={ async () => {
							const audioSource = await audioSourceService.setActiveSource(x.key);
							this.setState({ audioSource });
						} }>{x.key}</button>
					)) }
				</div>
			);
		} 

		return (
			<div className="audio">
				<Switch>
					<Route exact path={ matchedPath } render={ props => <AudioPlayer audioSource={ audioSource } { ...props } /> } />
					<Route path={ `${matchedPath}/browse` } render={ props => <SourceBrowser audioSource={ audioSource } { ...props } /> } />
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
