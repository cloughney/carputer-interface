import * as React from 'react';
import { AudioState, AudioSourceState } from 'state';
import { AudioSource, Category } from 'services/audio';
import { Redirect } from 'react-router';

import './source-browser.scss';

export interface Props {
	audioState: AudioState;
	sourcesPath: string;
}

export default class SourceBrowser extends React.Component<Props> {
    public constructor(props: Props) {
        super(props);
    }

    public async componentDidMount(): Promise<void> {
        const { audioState } = this.props;
        if (audioState.state !== AudioSourceState.Initialized) {
            return;
        }
	}

    public render() {
		const { audioState, sourcesPath } = this.props;
		
		if (audioState.state !== AudioSourceState.Initialized) {
			return <Redirect to={sourcesPath} />;
		}
		
		return null;
    }
}
