import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';

interface AudioViewProps extends React.Props<any> {
	// cart?: Cart;
	// onProductSelectionChange?: (product: Product, isSelected: boolean) => void;
}

interface AudioViewState {
	// isLoading: boolean;
	// productListings: Product[];
}

//function mapStateToProps(state: AppState): AudioViewProps {
	// return {
	// 	cart: state.cart
	// };
//}

//function mapDispatchToProps(dispatch: (action: Action) => Dispatch<Action>): AudioViewProps {
	// return {
	// 	onProductSelectionChange: (product: Product, isSelected: boolean) => {
	// 		const action = isSelected
	// 			? AddCartItemAction.create(product, 1)
	// 			: RemoveCartItemAction.create(product.itemId);
	//
	// 		dispatch(action);
	// 	}
	// };
//}

class AudioView extends React.Component<AudioViewProps, AudioViewState> {
	public constructor(props: AudioViewState) {
		super(props);
		this.state = { };
	}

	public componentWillMount(): void {

	}

	public render(): any {

		// return (
		// 	<div className="container shop-wrapper">
		// 		<h1>Products</h1>
		// 		<div className="product-list loading-container">
		// 			<ul className="list-unstyled row">
		// 				{ productListings }
		// 			</ul>
		//
		// 			{this.state.productListings.length < 1 &&
		// 				<FloatingMessage message="No products found." displayLink={false} />
		// 			}
		//
		// 			<LoadingOverlay isLoading={ this.state.isLoading } />
		// 		</div>
		// 	</div>
		// );
	}
}

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(AudioView);
