import * as React from 'react';

interface NavigationMapProps { }
interface NavigationMapState { }

export default class NavigationMap extends React.Component<NavigationMapProps, NavigationMapState> {
	private mapContainer: HTMLDivElement;
	private locationWatcherHandle: number;

	public constructor(props: NavigationMap) {
		super(props);
	}

	public componentDidMount(): void {
		const initialLocation = { lat: 0, lng: 0 };
		const map = this.initializeMap(initialLocation);
		const positionMarker = new google.maps.Marker({ position: initialLocation, map: map });

		this.locationWatcherHandle = navigator.geolocation.watchPosition(
			this.onPositionUpdate.bind(this, map, positionMarker),
			this.onPositionError);
	}

	public componentWillUnmount(): void {
		navigator.geolocation.clearWatch(this.locationWatcherHandle);
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

	private initializeMap = (location: google.maps.LatLngLiteral): google.maps.Map => {
		const map = new google.maps.Map(this.mapContainer, {
			center: location,
			zoom: 16,
			streetViewControl: false,
			mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		const traffic = new google.maps.TrafficLayer();
		traffic.setMap(map);

		return map;
	}
}
