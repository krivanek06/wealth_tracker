import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import {
	ChangePasswordGQL,
	ChangePasswordInput,
	ChangePasswordMutation,
	GetAuthenticatedUserDocument,
	GetAuthenticatedUserGQL,
	GetAuthenticatedUserQuery,
	LoginForgotPasswordInput,
	LoginUserBasicGQL,
	LoginUserBasicMutation,
	LoginUserInput,
	RegisterBasicGQL,
	RegisterBasicMutation,
	RegisterUserInput,
	ResetPasswordGQL,
	ResetPasswordMutation,
	UserFragment,
} from '../../graphql';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationApiService {
	constructor(
		private loginUserBasicGQL: LoginUserBasicGQL,
		private registerBasicGQL: RegisterBasicGQL,
		private resetPasswordGQL: ResetPasswordGQL,
		private changePasswordGQL: ChangePasswordGQL,
		private getAuthenticatedUserGQL: GetAuthenticatedUserGQL,
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
}
