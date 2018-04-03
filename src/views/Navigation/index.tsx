import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { AppState } from 'state';
import NavigationMap from '../../components/NavigationMap';

type Props = { };
type InjectedProps = Props & RouteComponentProps<void>;

const NavigationView: React.SFC = ({}) => {
	return (<NavigationMap></NavigationMap>);
}

const mapStateToProps = (state: AppState): Props => ({});
const mapDispatchToProps = (dispatch: Dispatch<Action>): Props => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavigationView);
