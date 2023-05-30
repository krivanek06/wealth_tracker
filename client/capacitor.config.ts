import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'spendmindful.com',
	appName: 'Spend Mindful',
	webDir: 'dist/client/browser',
	server: {
		androidScheme: 'https',
	},
	plugins: {
		SplashScreen: {
			launchShowDuration: 0,
		},
		GoogleAuth: {
			scopes: ['profile', 'email'],
			serverClientId: '921790580233-3gaelif340qt6te9oo0l7pis0u6kkg8v.apps.googleusercontent.com',
			forceCodeForRefreshToken: true,
		},
	},
};

export default config;
