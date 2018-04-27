import { Reducer } from 'redux';
import { UserConfiguration } from '..';
import * as Actions from 'state/actions';

export const configurationReducer: Reducer<UserConfiguration> = (state = {
	
}, action: Actions.SelectAudioSource) => {

	switch (action.type) {		
		default: return state;
	}
}
