import * as React from 'react';

import { googleMapsApiLoader } from 'services/navigation';

import './styles/navigation.scss';

export interface Props {
	setOverlayMessage(message: string | null): void;
}

export interface State { }

export default class NavigationMap extends React.Component<Props, State> {
	private mapContainer: HTMLDivElement | null;
	private locationWatcherHandle: number;

	public constructor(props: Props) {
		super(props);

		this.state = { };

		this.mapContainer = null;
		this.locationWatcherHandle = -1;
	}

	public async componentDidMount(): Promise<void> {
		if (this.mapContainer === null) {
			return;
		}

		this.props.setOverlayMessage('Locating your position...');
		let position: Coordinates;
		try {
			position = await this.getCurrentPosition(30000);
		} catch {
			this.props.setOverlayMessage('Unable to location your position.');
			return;
		}

		this.props.setOverlayMessage('Loading map...');
		await googleMapsApiLoader.load();

		this.props.setOverlayMessage(null);
		const mapPosition = { lat: position.latitude, lng: position.longitude };
		const map = googleMapsApiLoader.initializeMap(this.mapContainer, mapPosition);
		const positionMarker = new google.maps.Marker({ position: mapPosition, map: map });

		this.locationWatcherHandle = navigator.geolocation.watchPosition(
			this.onPositionUpdate.bind(this, map, positionMarker),
			this.onPositionError);
	}

	public componentWillUnmount(): void {
		navigator.geolocation.clearWatch(this.locationWatcherHandle);
	}

	public render(): JSX.Element {
		return (
			<div className="navigation">
				<div className="map" ref={ e => this.mapContainer = e } />
			</div>
		);
	}

	private getCurrentPosition(timeout: number): Promise<Coordinates> {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(x => resolve(x.coords), reject, { timeout });
		});
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
