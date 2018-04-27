import * as React from 'react';

export interface Props {
	isExpanded: boolean;
	side: 'left' | 'right';
}

export interface State {
	isExpanded: boolean;
}

export default class Menu extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);
		this.state = { isExpanded: props.isExpanded };
	}

	public render() {
		const { side, children } = this.props;
		const { isExpanded } = this.state;

		return (
			<div className={`menu ${side} ${ isExpanded ? 'out': 'in' }`}>
				{ side === 'left' ? children : null }
				<button className="hint" onClick={() => this.setState(x => ({ isExpanded: !x.isExpanded }))} />
				{ side === 'right' ? children : null }
			</div>
		);
	}
}
