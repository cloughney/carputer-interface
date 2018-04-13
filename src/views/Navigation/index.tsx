import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { AppState } from 'state';
import NavigationMap from '../../components/NavigationMap';

export interface Props { }

const NavigationView: React.SFC<Props> = () => {
	return <NavigationMap />;
}

const mapStateToProps = (state: AppState) => ({ });
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({ });

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavigationView);
