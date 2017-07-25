import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppState } from '../../../../common/state';

interface HomeViewProps { }
interface HomeViewState { }

function mapStateToProps(state: AppState): HomeViewProps {
	return { };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): HomeViewProps {
	return { };
}

class HomeView extends React.Component<HomeViewProps, HomeViewState> {
	public constructor(props: HomeViewProps) {
		super(props);
		this.state = { };
	}

	public render(): JSX.Element {
		return (
			<ul className="list-unstyled">
				<li><Link to="/audio">Audio</Link></li>
			</ul>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeView);
