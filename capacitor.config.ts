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
		FirebaseAuthentication: {
			skipNativeAuth: false,
			providers: ['google.com'],
		},
	},
};

export default config;
