import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './styles/home.scss';

import { AppState } from '../../../../common/state';

interface HomeViewProps { }
interface HomeViewState { }

class HomeView extends React.Component<HomeViewProps, HomeViewState> {
	public constructor(props: HomeViewProps) {
		super(props);
		this.state = { };
	}

	public render(): JSX.Element {
		const menuItems = ['audio', 'navigation', 'settings'].map((route, index) => (
			<li key={index} className="col-md-4">
				<Link to={ '/' + route }>
					<div className={ "menu-item " + route }>

					</div>
				</Link>
			</li>
		));

		return (
			<div className="container-fluid">
				<ul className="list-unstyled list-inline">
					{ menuItems }
				</ul>
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
