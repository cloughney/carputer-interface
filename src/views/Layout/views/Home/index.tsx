import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './styles/home.scss';

import { AppState } from '../../../../common/state';
import Menu, { MenuItem } from '../../../../components/Menu';

interface HomeViewProps { }
interface HomeViewState { }

class HomeView extends React.Component<HomeViewProps, HomeViewState> {
	private menuItems: MenuItem[];

	public constructor(props: HomeViewProps) {
		super(props);
		this.state = { };

		this.menuItems = [
			{ route: '/audio', className: 'audio' },
			{ route: '/navigation', className: 'navigation' },
			{ route: '/settings', className: 'settings' }
		];
	}

	public render(): JSX.Element {
		return (
			<div className="container-fluid">
				<Menu items={ this.menuItems } />
			</div>
		);
	}
}

const mapStateToProps = (state: AppState): HomeViewProps => ({});
const mapDispatchToProps = (dispatch: Dispatch<Action>): HomeViewProps => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeView);
