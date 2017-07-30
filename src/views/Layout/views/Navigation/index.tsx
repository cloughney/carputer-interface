import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './styles/navigation.scss';

import { AppState } from '../../../../common/state';
import NavigationMap from '../../../../components/NavigationMap';

interface NavigationViewProps { }
interface NavigationViewState { }

class NavigationView extends React.Component<NavigationViewProps, NavigationViewState> {
	public constructor(props: NavigationViewProps) {
		super(props);
		this.state = { };
	}

	public render(): JSX.Element {
		return (<NavigationMap></NavigationMap>);
	}
}

const mapStateToProps = (state: AppState): NavigationViewProps => ({});
const mapDispatchToProps = (dispatch: Dispatch<Action>): NavigationViewProps => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavigationView);
