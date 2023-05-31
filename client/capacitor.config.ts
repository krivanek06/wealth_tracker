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
			serverClientId: '921790580233-moqje7fjradeg9ccpugs4n28o19urhld.apps.googleusercontent.com',
			forceCodeForRefreshToken: true,
			clientId: '921790580233-moqje7fjradeg9ccpugs4n28o19urhld.apps.googleusercontent.com',
			androidClientId: '921790580233-h9q200ai8rasvji94of6pvf2n91bav49.apps.googleusercontent.com',
		},
	},
};

export default config;
