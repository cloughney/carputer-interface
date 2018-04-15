import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { AppState } from 'state';
import NavigationMap from '../../components/NavigationMap';

export interface Props {
	setOverlayMessage(message: string | null): void;
}

const NavigationView: React.SFC<Props> = ({ setOverlayMessage }) => {
	return <NavigationMap setOverlayMessage={ setOverlayMessage } />;
}

const mapStateToProps = (state: AppState) => ({ });

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
	setOverlayMessage: (message: string | null) => { dispatch({ type: 'OVERLAY_MESSAGE', message }) }
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavigationView);
