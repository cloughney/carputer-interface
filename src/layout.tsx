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

export namespace Layout {
	export type Props = {
		isHubConnected: boolean;
		overlayMessage: string | null;
	}
}

const Layout: React.SFC<Layout.Props> = ({ isHubConnected, overlayMessage }) => {
	return (
		<Router>
			<div className="app-container">
				<TopNavigation isHubConnected={isHubConnected} />
				<div className="app-content">
					<Switch>
						<Route exact path="/" component={ HomeView } />
						<Route path="/audio" component={ AudioView } />
						<Route path="/navigation" component={ NavigationView } />
					</Switch>
				</div>
				{ overlayMessage != null ? <div className="overlay"><span>{overlayMessage}</span></div> : null }
			</div>
		</Router>
	);
}

const mapStateToProps = (state: AppState) => ({
	isHubConnected: state.isHubConnected,
	overlayMessage: state.overlayMessage
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({ });

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Layout);
