import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link, RouteComponentProps, withRouter } from 'react-router-dom';

import './styles/layout.scss';

import { AppState } from '../../common/state';
import HomeView from './views/Home';
import AudioView from './views/Audio';
import NavigationView from './views/Navigation';

interface LayoutProps extends React.Props<Layout> {
	history?: any;
}

const TopNav = withRouter(({ location, history }: any) => {
	const onBackClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
		e.preventDefault();

		if (location.pathname !== '/') {
			history.goBack();
		}
	};

	return (
		<nav className="app-nav">
			<ul>
				<li style={{ visibility: location.pathname === '/' ? 'hidden' : undefined }}>
					<a href="#" onClick={ onBackClick }>
						<span className="glyphicon glyphicon-chevron-left"></span> Back
					</a>
				</li>
				<li>
					<Link to="/">
						<span className="glyphicon glyphicon-home"></span> Home
					</Link>
				</li>
			</ul>
		</nav>
	);
});

class Layout extends React.Component<LayoutProps, AppState> {
	public render(): any {
		return (
			<Router>
				<div className="app-container">
					<TopNav />
					<div className="app-content">
						<Switch>
							<Route exact path="/" component={ HomeView } />
							<Route path="/audio" component={ AudioView } />
							<Route path="/navigation" component={ NavigationView } />
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

function mapStateToProps(state: AppState, ownProps: LayoutProps): LayoutProps {
	return { };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): LayoutProps {
	return { };
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Layout);
