// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	version: '1.0.0',

	backend_url: 'http://localhost:3000',
	custom_graphql_backend_url: 'http://localhost:3000/graphql',
	custom_graphql_backend_ws: 'ws://localhost:3000/graphql',

	authentication: {
		web: {
			appId: '921790580233-i62eajkmv31d4p8610g3h16942vpq7a3.apps.googleusercontent.com',
			redirectUrl: 'http://localhost:4200',
		},
		android: {
			appId: '921790580233-3gaelif340qt6te9oo0l7pis0u6kkg8v.apps.googleusercontent.com',
			redirectUrl: 'http://localhost:4200',
		},
		ios: {
			appId: '',
			redirectUrl: 'http://localhost:4200',
		},
	},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
