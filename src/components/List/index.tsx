import * as React from 'react';
import { Link } from 'react-router-dom';

import './styles/list.scss';

export interface ListItem {
	text: string;
	route: string;
	className?: string;
}

export interface ListProps {
	items: ListItem[];
}

export default function List({ items }: ListProps): JSX.Element {

	const ListItems = items.map((item, index) => (
		<li key={index}>
			<Link to={ item.route }>
				<div className={ `list-item ${item.className}` }>
					{ item.text }
				</div>
			</Link>
		</li>
	));

	return (
		<ul className="list">
			{ ListItems }
		</ul>
	);
}
