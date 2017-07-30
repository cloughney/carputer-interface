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
	private locationWatcherHandle: number;

	public constructor(props: NavigationViewProps) {
		super(props);
		this.state = { };
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

const mapStateToProps = (state: AppState): NavigationViewProps => ({});
const mapDispatchToProps = (dispatch: Dispatch<Action>): NavigationViewProps => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavigationView);
