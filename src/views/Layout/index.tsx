import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './styles/layout.scss';

import { AppState } from '../../common/state';
import HomeView from './views/Home';
import AudioView from './views/Audio';
import NavigationView from './views/Navigation';
import ListView from './views/List';

interface LayoutProps extends React.Props<Layout> { }

class Layout extends React.Component<LayoutProps, AppState> {
	public render(): any {
		return (
			<Router>
				<div className="app-container">
					<nav className="app-nav">
						<ul>
							<li>
								<Link to="/">
									<span className="glyphicon glyphicon-home"></span> Home
								</Link>
							</li>
						</ul>
					</nav>
					<div className="app-content">
						<Switch>
							<Route exact path="/" component={ HomeView } />
							<Route path="/audio" component={ AudioView } />
							<Route path="/navigation" component={ NavigationView } />
							<Route path="/(.+)/list" component={ ListView } />
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

function mapStateToProps(state: AppState): LayoutProps {
	return { };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): LayoutProps {
	return { };
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Layout);
