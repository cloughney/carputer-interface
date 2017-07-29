import * as React from 'react';
import { Link } from 'react-router-dom';

import './styles/menu.scss';

export interface MenuItem {
	route: string;
	className?: string;
}

export interface MenuProps {
	items: MenuItem[];
	rowLength?: 1|2|3|4;
}

export default function Menu({
		items,
		rowLength = 3
	}: MenuProps): JSX.Element {

	const listItemClass = `col-md-${ 12 / rowLength }`;
	const menuItems = items.map((item, index) => (
		<li key={index} className={ listItemClass }>
			<Link to={ item.route }>
				<div className={ `menu-item ${item.className}` }>
					&nbsp;
				</div>
			</Link>
		</li>
	));

	return (
		<ul className="menu">
			{ menuItems }
		</ul>
	);
}
