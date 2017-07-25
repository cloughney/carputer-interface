import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { AppState } from './common/state';
import Layout from './views/Layout';

const stateStore = createStore<AppState>((state, action) => state);

ReactDOM.render(
	<Provider store={stateStore}>
		<Layout />
	</Provider>,
	document.getElementById('app'));
