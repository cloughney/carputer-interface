import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { AppState } from '../../../../common/state';
import Menu, { MenuItem } from '../../../../components/Menu';

interface AudioViewProps extends React.Props<any> {
	// cart?: Cart;
	// onProductSelectionChange?: (product: Product, isSelected: boolean) => void;
}

interface AudioViewState {
	// isLoading: boolean;
	// productListings: Product[];
}

class AudioView extends React.Component<AudioViewProps, AudioViewState> {
	private menuItems: MenuItem[];

	public constructor(props: AudioViewState) {
		super(props);
		this.state = { };

		this.menuItems = [
			{ route: '/audio/spotify/list', className: 'spotify' },
			{ route: '/audio/podcast', className: 'podcast' }
		];
	}

	public render(): JSX.Element {
		return (
			<div className="container-fluid">
				<Menu rowLength={3} items={ this.menuItems } />
			</div>
		);
	}
}

const mapStateToProps = (state: AppState): AudioViewProps => ({});
const mapDispatchToProps = (dispatch: Dispatch<Action>): AudioViewProps => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AudioView);
