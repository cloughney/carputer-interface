import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { AppState } from 'state';
import { appReducer } from 'state/reducers';
import { hubConnected, hubDisconnected } from 'state/actions';
import { client } from 'services/hub';
import Layout from './layout';

const stateStore = createStore<AppState>(
	appReducer,
	applyMiddleware(thunk)
);

client.addEventListener('connect', () => { stateStore.dispatch(hubConnected()); });
client.addEventListener('disconnect', () => { stateStore.dispatch(hubDisconnected()); });

client.connect();

ReactDOM.render(
	<Provider store={stateStore}>
		<Layout />
	</Provider>,
	document.getElementById('app'));
