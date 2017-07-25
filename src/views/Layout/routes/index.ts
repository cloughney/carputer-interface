import HomeView from '../views/Home';
import AudioView from '../views/Audio';

export const routes: {}[] = [
	{
		path: '/',
		exact: true,
		component: HomeView
	},
	{
		path: '/audio',
		component: AudioView
	}
];
