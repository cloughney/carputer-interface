import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import './styles/layout.scss';

import { AppState } from 'state';
import TopNavigation from './components/top-navigation'
import HomeView from './views/Home';
import AudioView from './views/Audio';
import NavigationView from './views/Navigation';
import SettingsView from './views/Settings';

export namespace Layout {
	export type Props = {
		isHubConnected: boolean;
	}
}

const Layout: React.SFC<Layout.Props> = ({ isHubConnected }) => {
	return (
		<Router>
			<div className="app-container">
				<TopNavigation isHubConnected={isHubConnected} />
				<div className="app-content">
					<Switch>
						<Route exact path="/" component={ HomeView } />
						<Route path="/audio" component={ AudioView } />
						<Route path="/navigation" component={ NavigationView } />
						<Route path="/settings" component={ SettingsView } />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

const mapStateToProps = (state: AppState) => ({
	isHubConnected: state.isHubConnected
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({ });

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Layout);
