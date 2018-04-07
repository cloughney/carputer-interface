import { Client } from './client';

export const client = new Client({ uri: 'ws://localhost:9000', protocol: 'user-interface' });