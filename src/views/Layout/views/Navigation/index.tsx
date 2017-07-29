import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './styles/navigation.scss';

import { AppState } from '../../../../common/state';

interface NavigationViewProps { }
interface NavigationViewState { }

class NavigationView extends React.Component<NavigationViewProps, NavigationViewState> {
	private mapContainer: HTMLDivElement;

	public constructor(props: NavigationViewProps) {
		super(props);
		this.state = { };
	}

	public componentDidMount(): void {
		navigator.geolocation.getCurrentPosition(pos => {
			const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };

			const map = new google.maps.Map(this.mapContainer, {
				center: location,
				zoom: 16,
				streetViewControl: false,
				mapTypeControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				styles: [
					{
						featureType: 'transit',
						stylers: [{ visibility: 'on' }]
					}
				]
			});

			const marker = new google.maps.Marker({
				position: location,
				map
			});

			const traffic = new google.maps.TrafficLayer();
			traffic.setMap(map);
		});
	}

	public render(): JSX.Element {
		return (
			<div className="navigation-map" ref={ e => this.mapContainer = e }></div>
		);
	}
}

const mapStateToProps = (state: AppState): NavigationViewProps => ({});
const mapDispatchToProps = (dispatch: Dispatch<Action>): NavigationViewProps => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavigationView);
