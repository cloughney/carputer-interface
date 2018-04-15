import * as React from 'react';
import { googleMapsApiLoader } from 'services/navigation';

import './navigation-map.scss';

export interface Props { }

export interface State {
	overlayMessage: string | null;
}

export default class NavigationMap extends React.Component<Props, State> {
	private mapContainer: HTMLDivElement | null;
	private locationWatcherHandle: number;

	public constructor(props: Props) {
		super(props);

		this.state = { overlayMessage: null };

		this.mapContainer = null;
		this.locationWatcherHandle = -1;
	}

	public async componentDidMount(): Promise<void> {
		if (this.mapContainer === null) {
			return;
		}

		this.setState({ overlayMessage: 'Locating your position...' });
		let position: Coordinates;
		try {
			position = await this.getCurrentPosition(30000);
		} catch {
			this.setState({ overlayMessage: 'Unable to location your position.' });
			return;
		}

		this.setState({ overlayMessage: 'Loading map...' });
		await googleMapsApiLoader.load();

		this.setState({ overlayMessage: null });
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
		const { overlayMessage } = this.state;

		return (
			<div className="navigation with-overlay">
				<div className="map" ref={ e => this.mapContainer = e } />
				{ overlayMessage != null ? <div className="overlay"><span>{overlayMessage}</span></div> : null }
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
