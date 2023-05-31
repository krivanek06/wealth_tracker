import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
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
	UserFragment,
} from '../../graphql';
import { IdToken } from '../../models';

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
		// open google sign in
		const user = await GoogleAuth.signIn();

		if (!user) {
			return null;
		}

		// parse idtoken
		const idTokenDecoded = this.parseJwt<IdToken>(user.authentication.idToken);

		// authenticate against server
		const authenticatedUser = await firstValueFrom(
			this.socialMediaLoginGQL.mutate({
				input: {
					accessToken: user.authentication.accessToken,
					provider: Authentication_Providers.Google,
					email: user.email,
					name: user.name,
					picture: user.imageUrl,
					verified_email: idTokenDecoded?.email_verified ?? false,
					locale: idTokenDecoded?.locale ?? null,
				},
			})
		);

		return authenticatedUser.data?.socialMediaLogin ?? null;
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

	private parseJwt = <T>(token: string): T | null => {
		try {
			return JSON.parse(atob(token.split('.')[1]));
		} catch (e) {
			return null;
		}
	};
}
