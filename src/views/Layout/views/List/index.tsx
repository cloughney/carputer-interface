import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

//import './styles/home.scss';

import { AppState } from '../../../../common/state';
import List, { ListItem } from '../../../../components/List';

interface ListViewProps {
	onItemSelected?: (item: ListItem) => void;
}
interface ListViewState { }

class ListView extends React.Component<ListViewProps, ListViewState> {
	private listItems: ListItem[];

	public constructor(props: ListViewProps) {
		super(props);
		this.state = { };

		this.listItems = [
			{ text: 'Playlists', className: 'audio' },
			{ text: 'Artists' },
			{ text: 'Albums' }
		];
	}

	public render(): JSX.Element {
		return (
			<div className="container-fluid">
				<List items={ this.listItems } onItemSelected={ this.props.onItemSelected } />
			</div>
		);
	}
}

const mapStateToProps = (state: AppState): ListViewProps => ({});
const mapDispatchToProps = (dispatch: Dispatch<Action>): ListViewProps => ({
	onItemSelected: item => {
		dispatch({
			type: 'LIST_ITEM_SELECTED',
		});
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ListView);
