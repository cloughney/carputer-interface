import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';

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

class HomeView extends React.Component<void, void> {
	public constructor(props: void) {
		super(props);
		//this.state = { };
	}
}

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(HomeView);
