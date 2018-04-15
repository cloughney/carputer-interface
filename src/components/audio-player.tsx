import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { AudioSource } from 'services/audio';

export interface Props extends RouteComponentProps<void> {
	audioSource: AudioSource | null;
}

export default class AudioPlayer extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render() {
		return (
			<div>
				<button onClick={ this.onPlayClick }>Play!</button>
			</div>
		);
	}

	private onPlayClick = async (): Promise<void> => {
		if (this.props.audioSource !== null) {
			this.props.audioSource.player.play();
		}
	}

	private onPauseClick = async (): Promise<void> => {
		if (this.props.audioSource !== null) {
			this.props.audioSource.player.pause();
		}
	}
}