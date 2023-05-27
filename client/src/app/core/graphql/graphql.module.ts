import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../../../environments/environment';
import { DialogServiceUtil } from '../../shared/dialogs';
import { STORAGE_AUTH_ACCESS_TOKEN, STORAGE_MAIN_KEY, StorageServiceStructure } from '../models';
import { PlatformService } from '../services/platform.service';
import {
	InvestmentAccountActiveHoldingOutput,
	InvestmentAccountTransactionOutput,
	PersonalAccountAggregationDataFragment,
	PersonalAccountTagFragment,
	PersonalAccountWeeklyAggregationFragment,
} from './schema-backend.service';

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
	// React only on graphql errors
	if (graphQLErrors && graphQLErrors.length > 0) {
		if ((graphQLErrors[0] as any)?.statusCode >= 400 && (graphQLErrors[0] as any)?.statusCode < 500) {
			// user rejected request error from server
			const message = Array.isArray(graphQLErrors[0].message) ? graphQLErrors[0].message[0] : graphQLErrors[0].message;
			DialogServiceUtil.showNotificationBar(message, 'error', 5000);
		} else {
			// server error with status 500 (do not display text)
			DialogServiceUtil.showNotificationBar(
				'An error happened on the server, we will be fixing it soon',
				'error',
				5000
			);
		}

		// log errors in console
		graphQLErrors.forEach(({ message, locations, path }) =>
			console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
		);
	}
	if (networkError) {
		console.log(`[Network error]:`, networkError);
		DialogServiceUtil.showNotificationBar(
			'A network error occurred while executing the operation. Try refreshing the page.',
			'error',
			5000
		);
	}
});

const getToken = (platform: PlatformService): string | null => {
	// console.log('getToken', platform, platform.isServer);

	if (platform.isServer) {
		return null;
	}

	const token = localStorage.getItem(STORAGE_MAIN_KEY);
	if (!token) {
		return null;
	}

	try {
		const parsed = JSON.parse(token) as StorageServiceStructure;
		const accessToken = parsed[STORAGE_AUTH_ACCESS_TOKEN]?.accessToken;

		return accessToken;
	} catch (err) {
		return null;
	}
};

const basicContext = (platform: PlatformService) =>
	setContext((_, { headers }) => {
		const token = getToken(platform);

		return {
			headers: {
				...headers,
				authorization: `Bearer ${token}`,
				'Content-Type': 'application/json', // Will break other content types (file upload)
			},
		};
	});

export function createDefaultApollo(httpLink: HttpLink, platform: PlatformService): ApolloClientOptions<any> {
	const cache = new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					getTransactionHistory: {
						merge(existing = [], incoming: InvestmentAccountTransactionOutput[]) {
							return [...incoming];
						},
					},
				},
			},
			InvestmentAccount: {
				fields: {
					activeHoldings: {
						merge(existing = [], incoming: InvestmentAccountActiveHoldingOutput[]) {
							return [...incoming];
						},
					},
				},
			},
			PersonalAccount: {
				fields: {
					personalAccountTag: {
						merge(existing = [], incoming: PersonalAccountTagFragment[]) {
							return [...incoming];
						},
					},
					yearlyAggregation: {
						merge(existing = [], incoming: PersonalAccountAggregationDataFragment[]) {
							return [...incoming];
						},
					},
					weeklyAggregation: {
						merge(existing = [], incoming: PersonalAccountWeeklyAggregationFragment[]) {
							return [...incoming];
						},
					},
				},
			},
		},
	});

	// create http with persisten queries
	// https://apollo-angular.com/docs/recipes/automatic-persisted-queries
	const http = httpLink.create({
		uri: environment.custom_graphql_backend_url,
	});

	// add token to WS connections
	// const ws = new WebSocketLink({
	// 	uri: environment.custom_graphql_backend_ws,
	// 	options: {
	// 		reconnect: true,
	// 		connectionParams: {
	// 			authorization: `Bearer ${getToken()}`,
	// 		},
	// 	},
	// });

	// depending on what kind of operation is being sent
	// const link = split(
	// 	// split based on operation type
	// 	({ query }) => {
	// 		const { kind, operation } = getMainDefinition(query) as any;
	// 		return kind === 'OperationDefinition' && operation === 'subscription';
	// 	},
	// 	ws,
	// 	http
	// );

	const config: ApolloClientOptions<any> = {
		connectToDevTools: !environment.production,
		assumeImmutableResults: true,
		ssrMode: true,
		cache,
		link: ApolloLink.from([basicContext(platform), errorLink, http]),
		defaultOptions: {
			watchQuery: {
				errorPolicy: 'all',
			},
		},
	};

	return config;
}

@NgModule({
	imports: [BrowserModule, HttpClientModule, ApolloModule],
	providers: [
		{
			provide: APOLLO_OPTIONS,
			useFactory: createDefaultApollo,
			deps: [HttpLink, PlatformService],
		},
	],
})
export class GraphQLModule {}
