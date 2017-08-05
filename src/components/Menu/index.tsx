import * as React from 'react';
import { Link } from 'react-router-dom';

import './styles/menu.scss';

export interface MenuItem {
	route: string;
	text?: string;
	className?: string;
}

export interface MenuProps {
	items: MenuItem[];
	rowLength?: 1|2|3|4;
	onItemSelect?: (item: MenuItem) => void;
}

export default function Menu({
		items,
		rowLength = 3,
		onItemSelect
	}: MenuProps): JSX.Element {

	const listItemClass = `col-xs-${ 12 / rowLength }`; //TODO remove bootstrap from html
	const menuItems = items.map((item, index) => (
		<li key={index} className={ listItemClass }>
			<Link to={ item.route } onClick={ () => { onItemSelect ? onItemSelect(item) : undefined; } }>
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
