import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { AppState } from '../../common/state';
import { routes } from './routes';

interface AppProps extends React.Props<any> { }

class Layout extends React.Component<AppProps, AppState> {
	public render(): any {
		return (
			<Router>
				<div className="container-fluid">
					<nav>
						<Link to="/">Home</Link>
					</nav>
					<div className="content">
						<Switch>
							{routes.map((route, i) => (<Route key={i} {...route} />))}
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

function mapStateToProps(state: AppState): AppProps {
	return { };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): AppProps {
	return { };
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Layout);
