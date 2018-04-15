import { Client } from './client';

export const client = new Client({ uri: 'wss://h.krik.co:9000', protocol: 'user-interface' });