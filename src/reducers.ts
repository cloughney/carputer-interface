import { combineReducers } from 'redux';

import { AppState } from 'state';
import audio from 'views/Layout/views/Audio/reducer'

export const appReducer = combineReducers<AppState>({
	audio
});
