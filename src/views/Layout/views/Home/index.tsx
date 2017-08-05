import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './styles/home.scss';

import { AppState } from 'state';
import Menu, { MenuItem } from '../../../../components/Menu';

const HomeView: React.SFC<{}> = (props) => {
	const menuItems = [
		{ route: '/audio', className: 'audio' },
		{ route: '/navigation', className: 'navigation' },
		{ route: '/settings', className: 'settings' },
		{ route: '/test/list', className: 'list' }
	];

	return (
		<div className="container-fluid">
			<Menu rowLength={3} items={ menuItems } />
		</div>
	);
}

const mapStateToProps = (state: AppState) => ({});
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeView);
