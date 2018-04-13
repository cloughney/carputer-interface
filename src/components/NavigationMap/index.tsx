import * as React from 'react';

import { googleMapsApiLoader } from 'services/navigation';

import './styles/navigation.scss';

export interface Props { }

export interface State { }

export default class NavigationMap extends React.Component<Props, State> {
	private mapContainer: HTMLDivElement | null;
	private locationWatcherHandle: number;

	public constructor(props: Props) {
		super(props);

		this.state = {};

		this.mapContainer = null;
		this.locationWatcherHandle = -1;
	}

	public async componentDidMount(): Promise<void> {
		if (this.mapContainer === null) {
			return;
		}

		const map = await googleMapsApiLoader.load(this.mapContainer);
		//const positionMarker = new google.maps.Marker({ position: { lat: 0, lng: 0 }, map: map });
		google.maps.event.trigger(map, 'resize');

		// this.locationWatcherHandle = navigator.geolocation.watchPosition(
		// 	this.onPositionUpdate.bind(this, map, positionMarker),
		// 	this.onPositionError);
	}

	public componentWillUnmount(): void {
		//navigator.geolocation.clearWatch(this.locationWatcherHandle);
	}

	public render(): JSX.Element {
		return (
			<div className="navigation-map" ref={ e => this.mapContainer = e }>

			</div>
		);
	}

	private onPositionUpdate = (map: google.maps.Map, marker: google.maps.Marker, position: Position): void => {
		const location: google.maps.LatLngLiteral = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};

		map.setCenter(location); //TODO logic for if user wants the map to follow
		marker.setPosition(location);
	};

	private onPositionError = (error: PositionError): void => {

	};
}
