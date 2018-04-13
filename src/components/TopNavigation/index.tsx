import * as React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

export namespace TopNavigation {
	export type Props = RouteComponentProps<void> & {
		isHubConnected: boolean;
	};
}

const TopNavigation: React.SFC<TopNavigation.Props> = ({ location, history, isHubConnected }) => {
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
					<span className={ `glyphicon glyphicon-${ isHubConnected ? 'cloud' : 'refresh' }` }></span>
				</li>
			</ul>
		</nav>
	);
};

export default withRouter(TopNavigation);
