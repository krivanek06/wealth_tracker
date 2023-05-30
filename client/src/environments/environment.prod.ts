export const environment = {
	production: true,
	version: '1.0.15',

	backend_url: 'https://spend-mindful-graphql-6bhi5d4fdq-ew.a.run.app',
	custom_graphql_backend_url: 'https://spend-mindful-graphql-6bhi5d4fdq-ew.a.run.app/graphql',
	custom_graphql_backend_ws: 'wss://spend-mindful-graphql-6bhi5d4fdq-ew.a.run.app/graphql',

	authentication: {
		web: {
			appId: '921790580233-moqje7fjradeg9ccpugs4n28o19urhld.apps.googleusercontent.com',
			redirectUrl: 'https://spendmindful.com',
		},
		android: {
			appId: '921790580233-3gaelif340qt6te9oo0l7pis0u6kkg8v.apps.googleusercontent.com',
			redirectUrl: 'spendmindful.com',
		},
		ios: {
			appId: '',
			redirectUrl: 'spendmindful.com',
		},
	},
};
