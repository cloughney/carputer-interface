import { GoogleMapsApiLoader } from './google-maps-loader';

const apiStorageKey = 'google_maps_api_key';
const apiKey = window.localStorage.getItem(apiStorageKey);
if (apiKey === null) {
    throw new Error(`Cannot find a Google Maps API key. Please set the '${apiStorageKey}' key in local storage.`);
}

export const googleMapsApiLoader = new GoogleMapsApiLoader(apiKey);