import * as React from 'react';
import { AudioState, AudioSourceState } from 'state';
import { AudioSource, Category } from 'services/audio';
import { Redirect } from 'react-router';

import './source-browser.scss';

export interface Props {
	audioState: AudioState;
}

export interface State {
    isAwaitingAuthentication: boolean;
    items: Category[];
}

export default class SourceBrowser extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            isAwaitingAuthentication: false,
            items: []
        };
    }

    public async componentDidMount(): Promise<void> {
        const { audioState } = this.props;
        if (audioState.state !== AudioSourceState.Initialized) {
            return;
        }

		try {
			const categories = await audioState.source.browser.getCategories();
			this.setState({ items: categories });
		} catch (err) {
			if (err instanceof XMLHttpRequest && err.status === 401) {
				this.setState({ isAwaitingAuthentication: true });
			}
		}
	}

    public render() {
        if (this.state.isAwaitingAuthentication) {
            return <Redirect to="/audio/spotify/connect" />; //TODO move redirect to audioSource impelmentation... probably
        }

        const tiles = this.state.items.map(x => 
            <div className="tile" key={x.id}>
                <img width="100%" src={x.image} /><br />
                {x.name}
            </div>);

        return (
            <div>{ tiles }</div>
        );
    }
}
