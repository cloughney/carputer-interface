import * as React from 'react';
import { Link } from 'react-router-dom';

import './styles/list.scss';

export interface ListItem {
	text: string;
	className?: string;
}

export interface ListProps {
	items: ListItem[];
	onItemSelected?: (item: ListItem) => void;
}

export default function List({
		items,
		onItemSelected
	}: ListProps): JSX.Element {

	const ListItems = items.map((item, index) => (
		<li key={index}>
			<div className={ `list-item ${item.className}` } onClick={ () => { onItemSelected(item) || undefined; } }>
				{ item.text }
			</div>
		</li>
	));

	return (
		<ul className="list">
			{ ListItems }
		</ul>
	);
}
