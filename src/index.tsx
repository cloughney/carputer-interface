import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { AppState } from 'state';
import { appReducer } from './reducers';
import { client } from 'services/hub';
import Layout from './layout';

const stateStore = createStore<AppState>(appReducer);

client.addEventListener('ready', () => { stateStore.dispatch({ type: 'HUB_CONNECT' }); });
client.connect();

ReactDOM.render(
	<Provider store={stateStore}>
		<Layout />
	</Provider>,
	document.getElementById('app'));
