import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { AppState } from '../../../../common/state';

interface AudioViewProps extends React.Props<any> {
	// cart?: Cart;
	// onProductSelectionChange?: (product: Product, isSelected: boolean) => void;
}

interface AudioViewState {
	// isLoading: boolean;
	// productListings: Product[];
}

function mapStateToProps(state: AppState): AudioViewProps {
	return {};
}

function mapDispatchToProps(dispatch: Dispatch<Action>): AudioViewProps {
	return {};
	// return {
	// 	onProductSelectionChange: (product: Product, isSelected: boolean) => {
	// 		const action = isSelected
	// 			? AddCartItemAction.create(product, 1)
	// 			: RemoveCartItemAction.create(product.itemId);
	//
	// 		dispatch(action);
	// 	}
	// };
}

class AudioView extends React.Component<AudioViewProps, AudioViewState> {
	public constructor(props: AudioViewState) {
		super(props);
		this.state = { };
	}

	public componentWillMount(): void {

	}

	public render(): JSX.Element {
		return (
			<div className="container-fluid audio">
				Audio
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AudioView);
