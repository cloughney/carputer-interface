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
	private map: google.maps.Map;

	public constructor(props: NavigationViewProps) {
		super(props);
		this.state = { };
	}

	public componentDidMount(): void {
		let positionMarker: google.maps.Marker;

		this.locationWatcherHandle = navigator.geolocation.watchPosition((pos => {
			const location: google.maps.LatLngLiteral = {
				lat: pos.coords.latitude,
				lng: pos.coords.longitude
			};

			if (!this.map) {
				this.map = this.initializeMap(location);
			}

			if (!positionMarker) {
				positionMarker = new google.maps.Marker({ position: location, map: this.map });
			} else {
				positionMarker.setPosition(location);
			}
		}));
	}

	public componentWillUnmount(): void {
		navigator.geolocation.clearWatch(this.locationWatcherHandle);
	}

	public render(): JSX.Element {
		return (
			<div className="navigation-map" ref={ e => this.mapContainer = e }></div>
		);
	}

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
