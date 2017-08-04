import * as React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';

import Menu, { MenuItem } from 'components/Menu';
import List, { ListItem } from 'components/List';

type State = {
	sources: any[];
};

export default class AudioSourceBrowser extends React.Component<RouteComponentProps<any>, State> {
	public constructor(props: RouteComponentProps<any>) {
		super(props);
		this.state = {
			sources: []
		};
	}

	public async componentWillMount(): Promise<void> {
		const response = await fetch('http://localhost:3000/api/audio/sources');
		const data = await response.json();
		this.setState({ sources: data.sources });
	}

	public render(): JSX.Element {
		const menuItems = this.state.sources.map(source => ({
			route: `/audio/sources/${source.slug}/browse`,
			className: source.slug
		}));

		//const entityItems = this

		return (
			<Switch>
				<Route exact path={ this.props.match.url } render={ () => <Menu items={ menuItems } /> } />
				<Route
					exact path={ `${this.props.match.url}/:source/browse` }
					render={ () => <List items={ [{ text: 'Playlists', route: `${this.props.match.url}/:source/browse/playlists` }] } /> } />
			</Switch>
		);
	}

	private getSources(): Promise<any[]> {
		return new Promise<any[]>(resolve => resolve([
			{ id: 1, slug: 'spotify', title: 'Spotify', image: 'spotify' },
			{ id: 2, slug: 'podcast', title: 'Podcasts', image: 'podcast' }
		]));
	}

	private getEntities(source: string): Promise<any[]> {
		return new Promise<any[]>(resolve => resolve([
			{ id: 1, slug: 'playlists', title: 'Playlists' }
		]));
	}
}
