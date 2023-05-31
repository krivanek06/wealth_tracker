export const environment = {
	production: true,
	version: '1.0.16',

	backend_url: 'https://spend-mindful-graphql-6bhi5d4fdq-ew.a.run.app',
	custom_graphql_backend_url: 'https://spend-mindful-graphql-6bhi5d4fdq-ew.a.run.app/graphql',
	custom_graphql_backend_ws: 'wss://spend-mindful-graphql-6bhi5d4fdq-ew.a.run.app/graphql',

	authentication: {
		web: {
			appId: '921790580233-moqje7fjradeg9ccpugs4n28o19urhld.apps.googleusercontent.com',
			redirectUrl: 'https://spendmindful.com',
		},
		android: {
			appId: '921790580233-h9q200ai8rasvji94of6pvf2n91bav49.apps.googleusercontent.com',
			redirectUrl: 'spendmindful.com',
		},
		ios: {
			appId: '',
			redirectUrl: 'spendmindful.com',
		},
	},
};
