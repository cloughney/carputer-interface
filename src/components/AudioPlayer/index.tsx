import * as React from 'react';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';

import { sources } from 'services/audio';

export namespace AudioPlayer {
	export type Props = RouteComponentProps<void> & {
		selectedSource: string;
	};
}

export default class AudioPlayer extends React.Component<AudioPlayer.Props> {
	public componentDidMount(): void {
		const source = sources[this.props.selectedSource];
	}

	public render() {
		return (
			<div>
				<span>Loading...</span>
			</div>
		);
	}
}