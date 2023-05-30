import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { OAuth2Client } from '@byteowls/capacitor-oauth2';
import { Apollo } from 'apollo-angular';
import { Observable, firstValueFrom, map } from 'rxjs';
import {
	Authentication_Providers,
	ChangePasswordGQL,
	ChangePasswordInput,
	ChangePasswordMutation,
	GetAuthenticatedUserDocument,
	GetAuthenticatedUserGQL,
	GetAuthenticatedUserQuery,
	LoggedUserOutput,
	LoginForgotPasswordInput,
	LoginSocialInputClient,
	LoginUserBasicGQL,
	LoginUserBasicMutation,
	LoginUserInput,
	RegisterBasicGQL,
	RegisterBasicMutation,
	RegisterUserInput,
	RemoveAccountGQL,
	RemoveAccountMutation,
	ResetPasswordGQL,
	ResetPasswordMutation,
	SocialMediaLoginGQL,
	SocialMediaLoginMutation,
	UserFragment,
} from '../../graphql';
import { environment } from './../../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationApiService {
	constructor(
		private loginUserBasicGQL: LoginUserBasicGQL,
		private socialMediaLoginGQL: SocialMediaLoginGQL,
		private registerBasicGQL: RegisterBasicGQL,
		private resetPasswordGQL: ResetPasswordGQL,
		private changePasswordGQL: ChangePasswordGQL,
		private getAuthenticatedUserGQL: GetAuthenticatedUserGQL,
		private removeAccountGQL: RemoveAccountGQL,
		private apollo: Apollo
	) {}

	get authenticatedUser(): UserFragment {
		const query = this.apollo.client.readQuery<GetAuthenticatedUserQuery>({
			query: GetAuthenticatedUserDocument,
		});

		if (!query || !query.getAuthenticatedUser) {
			throw new Error('No authenticated user found');
		}

		return query.getAuthenticatedUser;
	}

	getAuthenticatedUser(): Observable<UserFragment> {
		return this.getAuthenticatedUserGQL.watch().valueChanges.pipe(map((res) => res.data.getAuthenticatedUser));
	}

	loginUserBasic(input: LoginUserInput): Observable<FetchResult<LoginUserBasicMutation>> {
		return this.loginUserBasicGQL.mutate({
			input,
		});
	}

	async openSocialMediaLogin(): Promise<LoggedUserOutput | null> {
		const response = await OAuth2Client.authenticate({
			authorizationBaseUrl: 'https://accounts.google.com/o/oauth2/auth',
			accessTokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
			scope: 'email profile',
			resourceUrl: 'https://www.googleapis.com/userinfo/v2/me',
			logsEnabled: true,
			web: {
				appId: environment.authentication.web.appId,
				responseType: 'token', // implicit flow
				accessTokenEndpoint: '', // clear the tokenEndpoint as we know that implicit flow gets the accessToken from the authorizationRequest
				redirectUrl: environment.authentication.web.redirectUrl,
				windowOptions: 'height=600,left=0,top=0',
			},
			android: {
				appId: environment.authentication.android.appId,
				responseType: 'code', // if you configured a android app in google dev console the value must be "code"
				redirectUrl: environment.authentication.android.redirectUrl, // package name from google dev console
			},
			ios: {
				appId: environment.authentication.ios.appId,
				responseType: 'code', // if you configured a ios app in google dev console the value must be "code"
				redirectUrl: environment.authentication.ios.redirectUrl, // Bundle ID from google dev console
			},
		});

		if (!response) {
			return null;
		}

		const user = await firstValueFrom(
			this.socialMediaLogin({
				accessToken: response.access_token,
				provider: Authentication_Providers.Google,
				email: response.email,
				locale: response.locale,
				name: response.name,
				picture: response.picture,
				verified_email: response.verified_email,
			})
		);

		return user.data?.socialMediaLogin ?? null;
	}

	resetPassword(input: LoginForgotPasswordInput): Observable<FetchResult<ResetPasswordMutation>> {
		return this.resetPasswordGQL.mutate({
			input,
		});
	}

	registerBasic(input: RegisterUserInput): Observable<FetchResult<RegisterBasicMutation>> {
		return this.registerBasicGQL.mutate({
			input,
		});
	}

	changePassword(input: ChangePasswordInput): Observable<FetchResult<ChangePasswordMutation>> {
		return this.changePasswordGQL.mutate({
			input,
		});
	}

	removeAccount(): Observable<FetchResult<RemoveAccountMutation>> {
		return this.removeAccountGQL.mutate();
	}

	private socialMediaLogin(input: LoginSocialInputClient): Observable<FetchResult<SocialMediaLoginMutation>> {
		return this.socialMediaLoginGQL.mutate({
			input,
		});
	}
}
