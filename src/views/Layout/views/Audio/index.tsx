import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { AppState } from '../../../../common/state';
import Menu, { MenuItem } from '../../../../components/Menu';
import List, { ListItem } from '../../../../components/List';

interface AudioViewProps extends React.Props<any> {
	// cart?: Cart;
	// onProductSelectionChange?: (product: Product, isSelected: boolean) => void;
}

interface AudioViewState {
	// isLoading: boolean;
	// productListings: Product[];
}

class AudioView extends React.Component<AudioViewProps, AudioViewState> {
	private menuItems: MenuItem[];
	private listItems: ListItem[];

	public constructor(props: AudioViewState) {
		super(props);
		this.state = { };

		const audioSources: any[] = [
			{ id: 1, slug: 'spotify', title: 'Spotify', image: 'spotify' },
			{ id: 2, slug: 'spotify', title: 'Spotify', image: 'podcast' }
		];

		this.menuItems = audioSources.map(source => ({
			route: `/audio/${source.slug}/browse`,
			className: source.image
		}));

		this.listItems = [
			{ route: '/audio/spotify/browse', text: '' }
		]
	}

	public render(): JSX.Element {
		return (
			<div className="container-fluid">
				<Switch>
					<Route exact path="/audio" render={ () => <Menu rowLength={3} items={ this.menuItems } /> } />
					<Route path="/audio/spotify" component={ (props) => {
						return (<List items={ [{ route: '', text: '' }] } />);
					} } />
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = (state: AppState): AudioViewProps => ({});
const mapDispatchToProps = (dispatch: Dispatch<Action>): AudioViewProps => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AudioView);
