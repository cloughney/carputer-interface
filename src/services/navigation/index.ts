import { GoogleMapsApiLoader } from './google-maps-loader';

export const googleMapsApiLoader = new GoogleMapsApiLoader(window.localStorage.getItem('google_maps_api_key') || 'invalid_key');