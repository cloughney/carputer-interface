const nullSocketError = 'The client must be connected to perform this action.';

type EventListenerMap = { [EventType in keyof ClientEventMap]: (e: ClientEventMap[EventType]) => void };
type MultiEventListenerMap = { [T in keyof EventListenerMap]: EventListenerMap[T][] };

type ClientEventMap = {
    'ready': Event;
    'error': Event;
    [eventType: string]: Event;
};

export interface ClientConfiguration {
    uri: string;
    protocol: string;
}

export interface Message {
    type: string;
    data: { [key: string]: any };
}

export type RequestHandler = (message: Message) => Promise<Message>;

export class ClientNotConnectedError extends Error { }

export class Client {
    private readonly config: ClientConfiguration;
    private readonly requestResolutionMap: Map<string, (value?: any) => void>;
    private readonly eventListeners: MultiEventListenerMap;
    private socket: WebSocket | null;
    private onRequestHandler: RequestHandler | null;

	public constructor(config: ClientConfiguration) {
        this.config = config;
        this.requestResolutionMap = new Map();

        this.eventListeners = {
            'ready': [],
            'error': []
        };

        this.socket = null;
        this.onRequestHandler = null;
	}

    public get isConnected(): boolean { return this.socket !== null && this.socket.readyState === WebSocket.OPEN; }

    /** A handler for incoming requests. */
    public set onRequest(handler: RequestHandler) {
        if (this.onRequestHandler !== null) {
            throw new Error('The onRequest handler has already been assigned.');
        }

        this.onRequestHandler = handler;
    }
    
    /** Adds a listener to the specified event. */
    public addEventListener<T extends keyof EventListenerMap>(type: T, listener: EventListenerMap[T]): void {
        this.eventListeners[type].push(listener);
    }

    /** Connects the client to the configured endpoint. */
	public connect(): void {
        if (this.socket !== null) {
            throw new Error('The client is already connected.');
        }

		this.socket = new WebSocket(this.config.uri, this.config.protocol);
        this.socket.addEventListener('open', e => this.eventListeners.ready.forEach(listener => listener(e)));
        this.socket.addEventListener('error', e => this.eventListeners.error.forEach(listener => listener(e)));
        this.socket.addEventListener('message', this.onMessage.bind(this));
	}

    /** Disconnects the client. */
	public disconnect(): void {
        if (this.socket === null) {
			throw new ClientNotConnectedError(nullSocketError);
        }

		this.socket.close();
		this.socket = null;
	}

    /** Post an event to be broadcast. */
	public post(type: string, payload?: any): void {
		this.sendMessage('event', type, payload);
    }

    /** Send a request to the specified destination. */
    public async request<T = any>(destination: string, type: string, payload?: any): Promise<T> {
        const requestId = this.generateRequestId();

        const requestPromise = new Promise<T>((resolve, reject) => {
            this.requestResolutionMap.set(requestId, resolve);

            this.sendMessage('request', type, {
                _requestId: requestId,
                destination,
                ...payload
            });

            setTimeout(() => {
                reject('The request has timed out.');
                this.requestResolutionMap.delete(requestId);
            }, 10000);
        });

        const response = await requestPromise;
        this.requestResolutionMap.delete(requestId);

        return response;
    }
    
    private onMessage(e: MessageEvent): void {
        //TODO message validation

        const message = e.data;
        switch (message.type) {
            case 'event':
                this.onEventReceived(message);
                break;
            case 'request':
                this.onRequestReceived(message);
                break;
            case 'response':
                this.onResponseReceived(message);
                break;
            default:
                throw new Error(`Invalid message type received: '${message.type}'.`);
        }
    }

    private onEventReceived(message: any): void {
        const listeners = this.eventListeners[message.name];
        if (typeof listeners === 'object' && listeners.length !== undefined) {
            listeners.forEach(x => x(message));
        }
    }

    private async onRequestReceived(message: any): Promise<any> {
        if (this.onRequestHandler === null) {
            console.warn('A request was received but no onRequest handler has been set.');
            return;
        }

        const response = await this.onRequestHandler(message);
        this.sendMessage('response', message.name, { ...response, request: message });
    }

    private onResponseReceived(message: any): void {
        const requestId = message.request._requestId;
        const resolveResponse = this.requestResolutionMap.get(requestId);

        if (typeof resolveResponse !== 'function') {
            return;
        }

        resolveResponse(message);
        this.requestResolutionMap.delete(message._requestId);
    }

    private generateRequestId(): string {
        const now = new Date().getTime();
        const modifier = Math.random();
        return Math.ceil(now * modifier).toString(); // this should be unique enough for this purpose
    }

    private sendMessage(type: 'event' | 'request' | 'response', name: string, payload: any): void {
        if (this.socket === null) {
			throw new ClientNotConnectedError(nullSocketError);
        }
        
		if (this.socket.readyState !== WebSocket.OPEN) {
			throw new ClientNotConnectedError(`The client is not in a valid state to perform this action. (state: ${this.socket.readyState})`);
        }
        
		this.socket.send(JSON.stringify({ type, name, ...payload }));
    }
}