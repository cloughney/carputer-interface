import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';

import './index.scss';

import { AppState } from 'state';

const SettingsView: React.SFC<{}> = (props) => {
	
	return (
		<div className="settings">
			<button onClick={ window.location.reload.bind(window.location, true) }>Refresh Page</button>
		</div>
	);
}

const mapStateToProps = (state: AppState) => ({});
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SettingsView);
