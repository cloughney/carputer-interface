const nullSocketError = 'The client must be connected to perform this action.';

type ClientEventMap = {
    [eventType: string]: any;
};

type EventListenerMap = { [EventType in keyof ClientEventMap]: (e: ClientEventMap[EventType]) => void };
type MultiEventListenerMap = { [T in keyof EventListenerMap]: EventListenerMap[T][] };

type DestinationMessageType = 'request' | 'response' | 'error';
type MessageType = DestinationMessageType | 'event';

export interface ClientConfiguration {
    uri: string;
    protocol: string;
}

export interface RequestMessage {
    type: 'request';
    origin?: string;
    destination: string;
    name: string;
    data: { [key: string]: any };
}

export interface ResponseMessage {
    type: 'response';
    destination: string;
    request: RequestMessage;
    data: { [key: string]: any };
}

export interface ErrorMessage {
    type: 'error';
    destination: string;
    request: RequestMessage;
    data: { error: string };
}

export interface EventMessage {
    type: 'event';
    name: string;
    data: { [key: string]: any };
}

export type Message = RequestMessage | ResponseMessage | ErrorMessage | EventMessage;

export type RequestHandler = (message: RequestMessage) => Promise<any>;

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

        this.eventListeners = {};

        this.socket = null;
        this.onRequestHandler = null;
	}

    public get isConnected(): boolean { return this.socket !== null && this.socket.readyState === WebSocket.OPEN; }

    /** Sets a handler for incoming requests. */
    public set onRequest(handler: RequestHandler) {
        if (this.onRequestHandler !== null) {
            throw new Error('The onRequest handler has already been assigned.');
        }

        this.onRequestHandler = handler;
    }
    
    /** Adds a listener to the specified event. */
    public addEventListener<T extends keyof EventListenerMap>(type: T, listener: EventListenerMap[T]): void {
        const listeners = this.eventListeners[type] || [];
        listeners.push(listener);
        this.eventListeners[type] = listeners;
    }
    
    /** Removes a listener from the specified event. */
    public removeEventListener<T extends keyof EventListenerMap>(type: T, listener: EventListenerMap[T]): void {
        const listeners = this.eventListeners[type];
        if (listeners === undefined) {
            return;
        }

        const listenerIndex = listeners.indexOf(listener);
        listeners.splice(listenerIndex, 1);
    }

    /** Connects the client to the configured endpoint. */
	public connect(): void {
        if (this.socket !== null) {
            throw new Error('The client is already connected.');
        }

		this.socket = new WebSocket(this.config.uri, this.config.protocol);
        this.socket.addEventListener('open', this.onSocketOpen);
        this.socket.addEventListener('close', this.onSocketClose);
        this.socket.addEventListener('error', this.onSocketError);
        this.socket.addEventListener('message', this.onSocketMessage);
	}

    /** Disconnects the client. */
	public disconnect(): void {
        if (this.socket === null) {
			throw new ClientNotConnectedError(nullSocketError);
        }

        this.socket.removeEventListener('open', this.onSocketOpen);
        this.socket.removeEventListener('close', this.onSocketClose);
        this.socket.removeEventListener('error', this.onSocketError);
        this.socket.removeEventListener('message', this.onSocketMessage);

        if (this.socket.readyState !== WebSocket.CLOSED) {
            this.socket.close();
        }

		this.socket = null;
	}

    /** Publishes an event to be broadcast. */
	public publish(type: string, payload?: any): void {
		if (this.socket === null) {
			throw new ClientNotConnectedError(nullSocketError);
        }
        
		if (this.socket.readyState !== WebSocket.OPEN) {
			throw new ClientNotConnectedError(`The client is not in a valid state to perform this action. (state: ${this.socket.readyState})`);
        }

        this.socket.send(JSON.stringify({
            type: 'event',
            origin: this.config.protocol,
            name: type,
            data: payload
        }));
    }

    /** Sends a request to the specified destination and awaits a response. */
    public async request<T = any>(destination: string, type: string, payload?: any): Promise<T> {
        const requestId = this.generateRequestId();

        const requestPromise = new Promise<T>((resolve, reject) => {
            this.requestResolutionMap.set(requestId, resolve);

            this.sendMessage({
                type: 'request', 
                destination,
                name: type,
                data: {
                    _requestId: requestId,
                    ...payload
                }
            });

            window.setTimeout(() => {
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

        const message = JSON.parse(e.data) as Message;
        switch (message.type) {
            case 'event':
                this.onEventReceived(message);
                break;
            case 'request':
                this.onRequestReceived(message);
                break;
            case 'response':
            case 'error':
                this.onResponseReceived(message);
                break;
            default:
                throw new Error(`Invalid message type received: '${(<any>message).type}'.`);
        }
    }

    private onEventReceived(message: EventMessage): void {
        const listeners = this.eventListeners[message.name];
        if (typeof listeners === 'object' && listeners.length !== undefined) {
            listeners.forEach(x => x(message));
        }
    }

    private async onRequestReceived(message: RequestMessage): Promise<any> {
        if (this.onRequestHandler === null) {
            console.warn('A request was received but no onRequest handler has been set.');
            return;
        }

        if (message.origin === undefined) {
            throw new Error('An invalid request was received.');
        }

        try {
            const response = await this.onRequestHandler(message);
            this.sendMessage({
                type: 'response',
                destination: message.origin,
                request: message,
                data: { ...response, request: message }
            });
        } catch (err) {
            this.sendMessage({
                type: 'error',
                destination: message.origin,
                request: message,
                data: { error: err.message }
            });
        }
    }

    private onResponseReceived(message: ResponseMessage | ErrorMessage): void {
        const requestId = message.request.data._requestId;
        const resolveResponse = this.requestResolutionMap.get(requestId);

        if (typeof resolveResponse !== 'function') {
            return;
        }

        resolveResponse(message.data);
        this.requestResolutionMap.delete(requestId);
    }

    private generateRequestId(): string {
        const now = new Date().getTime();
        const modifier = Math.random();
        return Math.ceil(now * modifier).toString(); // this should be unique enough for this purpose
    }

    private sendMessage(message: Message): void {
        if (this.socket === null) {
			throw new ClientNotConnectedError(nullSocketError);
        }
        
		if (this.socket.readyState !== WebSocket.OPEN) {
			throw new ClientNotConnectedError(`The client is not in a valid state to perform this action. (state: ${this.socket.readyState})`);
        }
        
		this.socket.send(JSON.stringify(message));
    }

    private onSocketOpen = (): void => {
        if (this.eventListeners['connect'] !== undefined) {
            this.eventListeners['connect'].forEach(listener => listener(undefined)); //TODO fix the client event map to get rid on the undefined here
        }
    }
    
    private onSocketError = (e: Event): void => {
        if (this.eventListeners['error'] !== undefined) {
            this.eventListeners['error'].forEach(listener => listener((<ErrorEvent>e).message));
        }
    }

    private onSocketMessage = (e: MessageEvent): void => this.onMessage(e);

    private onSocketClose = (): void => {
        if (this.eventListeners['disconnect'] !== undefined) {
            this.eventListeners['disconnect'].forEach(listener => listener(undefined));
        }

        const reconnectInterval = window.setInterval(() => {
            if (this.isConnected) {
                clearInterval(reconnectInterval);
                return;
            }

            this.disconnect();
            this.connect();
        }, 5000);
    };
}
