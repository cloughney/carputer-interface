import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

//import routes from './common/routes';

interface AppProps extends React.Props<any> {
	//cart?: Cart;
}

function mapStateToProps(state: AppState): AppProps {
	return {
		//cart: state.cart
	};
}

function mapDispatchToProps(dispatch: (action: Action) => Dispatch<Action>): AppProps {
	return {};
}

const routes: {}[] = [
	// {
	// 	path: '/',
	// 	exact: true,
	// 	component: ShopView
	// },
	// {
	// 	path: '/cart',
	// 	component: CartView
	// }
];

class App extends React.Component<AppProps, undefined> {
	public render(): any {
		return (
			<Router>
				<div className="container">
				<Switch>
					{routes.map((route, i) => (<Route key={i} {...route} />))}
				</Switch>
				</div>
			</Router>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
