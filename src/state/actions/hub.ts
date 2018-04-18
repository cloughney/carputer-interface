export const HUB_CONNECTED = 'HUB_CONNECTED';
export type HUB_CONNECTED = typeof HUB_CONNECTED;

export const HUB_DISCONNECTED = 'HUB_DISCONNECTED';
export type HUB_DISCONNECTED = typeof HUB_DISCONNECTED;

export interface HubDisconnected {
    type: HUB_DISCONNECTED;
}

export interface HubConnected {
    type: HUB_CONNECTED;
}

export type HubConnection = HubConnected | HubDisconnected;

export const hubConnected = (): HubConnected => ({ type: HUB_CONNECTED });
export const hubDisconnected = (): HubDisconnected => ({ type: HUB_DISCONNECTED });