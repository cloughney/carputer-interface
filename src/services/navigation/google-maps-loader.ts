export class GoogleMapsApiLoader {
    private static libraryCallback = '_onGoogleMapsLibraryLoaded';
    private apiKey: string;
    private map: google.maps.Map | null;

    public constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.map = null;
    }

    public async load(container: Element): Promise<google.maps.Map> {
        if (this.map === null) {
            await this.importLibrary();
            this.map = this.initializeMap(container, { lat: 0, lng: 0 });
        }

        return this.map;
    }

    private importLibrary(): Promise<void> {
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

    private initializeMap(container: Element, location: google.maps.LatLngLiteral): google.maps.Map {
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