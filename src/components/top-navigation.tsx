import * as React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

import './top-navigation.scss';

export interface Props extends RouteComponentProps<void> {
	isHubConnected: boolean;
}

const TopNavigation: React.SFC<Props> = ({ location, history, isHubConnected }) => {
	const isHome = location.pathname === '/';

	const onBackClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
		e.preventDefault();

		if (!isHome) {
			history.goBack();
		}
	};

	return (
		<nav className="app-nav">
			<ul>
				<li style={{ visibility: isHome ? 'hidden' : undefined }}>
					<a href="#" onClick={ onBackClick }>
						<span className="glyphicon glyphicon-chevron-left"></span> Back
					</a>
				</li>
				<li>
					<Link to="/">
						<span className="glyphicon glyphicon-home"></span> Home
					</Link>
				</li>
				<li>
					<span className={ `glyphicon glyphicon-${ isHubConnected ? 'cloud text-success' : 'refresh text-warning' }` }></span>
				</li>
			</ul>
		</nav>
	);
};

export default withRouter(TopNavigation);
