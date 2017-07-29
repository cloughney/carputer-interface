import HomeView from '../views/Home';
import AudioView from '../views/Audio';
import NavigationView from '../views/Navigation';

export const routes: {}[] = [
	{
		path: '/',
		exact: true,
		component: HomeView
	},
	{
		path: '/audio',
		component: AudioView
	},
	{
		path: '/navigation',
		component: NavigationView
	}
];
