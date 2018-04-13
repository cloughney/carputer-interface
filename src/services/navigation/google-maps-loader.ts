export interface InitializedMap {
    map: google.maps.Map;
    container: Element;
}

export class GoogleMapsApiLoader {
    private static libraryCallback = '_onGoogleMapsLibraryLoaded';
    private readonly apiKey: string;
    private element: Element | null;
    private map: google.maps.Map | null;

    public constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.element = null;
        this.map = null;
    }

    public load(): Promise<void> {
        if (this.map !== null) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            (<any>window)[GoogleMapsApiLoader.libraryCallback] = () => {
                delete (<any>window)[GoogleMapsApiLoader.libraryCallback];
                resolve();
            };

            const element = document.createElement('script');
            element.src = `https://maps.googleapis.com/maps/api/js?key=${ this.apiKey }&callback=${ GoogleMapsApiLoader.libraryCallback }`;
            window.document.head.appendChild(element);
        });
    }

    public initializeMap(container: Element, location: google.maps.LatLngLiteral): google.maps.Map {
        this.element = container;
        const map = new google.maps.Map(container, {
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