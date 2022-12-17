import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { map, Observable } from 'rxjs';
import {
	GetAuthenticatedUserGQL,
	LoginUserBasicGQL,
	LoginUserBasicMutation,
	LoginUserInput,
	RegisterBasicGQL,
	RegisterBasicMutation,
	RegisterUserInput,
	UserFragment,
} from '../../graphql';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationApiService {
	constructor(
		private loginUserBasicGQL: LoginUserBasicGQL,
		private registerBasicGQL: RegisterBasicGQL,
		private getAuthenticatedUserGQL: GetAuthenticatedUserGQL
	) {}

	getAuthenticatedUser(): Observable<UserFragment> {
		return this.getAuthenticatedUserGQL.watch().valueChanges.pipe(map((res) => res.data.getAuthenticatedUser));
	}

	loginUserBasic(input: LoginUserInput): Observable<FetchResult<LoginUserBasicMutation>> {
		return this.loginUserBasicGQL.mutate({
			input,
		});
	}

	registerBasic(input: RegisterUserInput): Observable<FetchResult<RegisterBasicMutation>> {
		return this.registerBasicGQL.mutate({
			input,
		});
	}
}
