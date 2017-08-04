import * as React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';

import Menu, { MenuItem } from '../Menu';

type Props = { };

type State = {
	sources: any[];
};

type InjectedProps = Props & RouteComponentProps<void>;

export default class AudioSourceBrowser extends React.Component<InjectedProps, State> {
	public constructor(props: InjectedProps) {
		super(props);
		this.state = {
			sources: []
		};
	}

	public render(): JSX.Element {
		const menuItems = this.state.sources.map(source => ({
			route: `/audio/sources/${source.slug}/browse`,
			className: source.image
		}));

		return (
			<Switch>
				<Route exact path={ this.props.match.url } render={ () => <Menu items={ menuItems } /> } />
			</Switch>
		);
	}

	public async componentWillMount(): Promise<void> {
		const sources = await this.getSources();
		this.setState({ sources	});
	}

	private getSources(): Promise<any[]> {
		return new Promise<any[]>(resolve => {
			resolve([
				{ id: 1, slug: 'spotify', title: 'Spotify', image: 'spotify' },
				{ id: 2, slug: 'podcast', title: 'Podcasts', image: 'podcast' }
			]);
		})
	}
}
