import * as React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';

import { AudioSource } from 'state/audio';
import Menu, { MenuItem } from 'components/Menu';
import ItemBrowser from './components/ItemBrowser';

type Props = {
	selectedSource: AudioSource;
	onSourceSelect: (source: AudioSource) => void;
};

type RouteParams = {
	source: string;
};

type RouteProps = Props & RouteComponentProps<any>;

type State = {
	sources: AudioSource[];
};

export default class AudioSourceBrowser extends React.Component<RouteProps, State> {
	public constructor(props: RouteProps) {
		super(props);
		this.state = {
			sources: []
		};
	}

	public async componentWillMount(): Promise<void> {
		if (this.props.selectedSource) {
			return;
		}

		const response = await fetch('/api/audio/sources');
		const data = await response.json();

		let selectAudioSource: AudioSource;
		const sources: AudioSource[] = [];
		data.sources.forEach((s: any) => {
			const source: AudioSource = {
				slug: s.slug,
				title: s.title,
				href: s.href
			};

			if (this.props.match.params.source === source.slug) {
				selectAudioSource = source;
				this.props.onSourceSelect(source);
			}

			sources.push(source);
		});

		this.setState({ sources });
	}

	public render(): JSX.Element {
		const menuItems = this.state.sources.map(source => ({
			route: `/audio/sources/${source.slug}/browse`,
			className: source.slug
		}));

		return (
			<Switch>
				<Route exact path={ this.props.match.url } render={ () => <Menu items={ menuItems } /> } />
				<Route exact path={ `${this.props.match.url}/:source/browse` } render={ () => <ItemBrowser href={ this.props.selectedSource.href } /> } />
			</Switch>
		);
	}
}
