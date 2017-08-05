import * as React from 'react';

import AudioSource from '../../';
import List, { ListItem } from 'components/List';

interface SourceItem {

}

type Props = {
	href: string;
};

type State = {
	items: SourceItem[];
};

export default class ItemBrowser extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			items: []
		};
	}

	public async componentWillMount(): Promise<void> {
		const response = await fetch(this.props.href);
		const data = await response.json();
		this.setState({ items: data.items });
	}

	public render(): JSX.Element {
		const listItems: ListItem[] = this.state.items.map(item => ({
			route: '',
			text: '',
			className: ''
		}));

		return (<List items={ listItems } />);
	}
};
