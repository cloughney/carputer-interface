import * as React from 'react';
import { Link } from 'react-router-dom';

import './styles/menu.scss';

export interface MenuItem {
	route: string;
	text?: string;
	className?: string;
}

export interface Props {
	items: MenuItem[];
	rowLength?: 1|2|3|4;
	onItemSelect?: (item: MenuItem) => void;
}

const Menu: React.SFC<Props> = ({ items, rowLength = 3, onItemSelect }) => {
	const listItemClass = `col-xs-${ 12 / rowLength }`; //TODO remove bootstrap from html
	const menuItems = items.map((item, index) => (
		<li key={index} className={ listItemClass }>
			<Link to={ item.route } onClick={ () => { onItemSelect ? onItemSelect(item) : undefined; } }>
				<div className={ `menu-item ${item.className}` }>&nbsp;</div>
			</Link>
		</li>
	));

	return (
		<ul className="menu">
			{ menuItems }
		</ul>
	);
}

export default Menu;