import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'spendmindful.com',
	appName: 'Spend Mindful',
	webDir: 'dist/client/browser',
	server: {
		androidScheme: 'https',
	},
};

export default config;
