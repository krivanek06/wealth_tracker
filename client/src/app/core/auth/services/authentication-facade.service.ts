import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthenticationApiService } from '../../api';
import { LoggedUserOutputFragment, LoginUserInput, RegisterUserInput, UserFragment } from '../../graphql';
import { TokenStorageService } from './token-storage.service';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationFacadeService {
	constructor(
		private tokenStorageService: TokenStorageService,
		private authenticationApiService: AuthenticationApiService,
		private apollo: Apollo
	) {}

	getAuthenticatedUser(): Observable<UserFragment | null> {
		return this.tokenStorageService
			.getAccessToken()
			.pipe(switchMap((token) => (!token ? of(null) : this.authenticationApiService.getAuthenticatedUser())));
	}

	logoutUser(): void {
		// remove token from localstorage
		this.tokenStorageService.setAccessToken(null);
		// clear graphql cache
		this.apollo.client.cache.reset();
	}

	setAccessToken(token: LoggedUserOutputFragment | null): void {
		this.tokenStorageService.setAccessToken(token);
	}

	loginUserBasic(input: LoginUserInput): Observable<UserFragment> {
		return this.authenticationApiService.loginUserBasic(input).pipe(
			map((res) => res.data?.loginBasic as LoggedUserOutputFragment),
			tap((res) => {
				this.tokenStorageService.setAccessToken(res);
			}),
			switchMap(() => this.authenticationApiService.getAuthenticatedUser()),
			catchError(() => EMPTY)
		);
	}

	registerBasic(input: RegisterUserInput): Observable<UserFragment> {
		return this.authenticationApiService.registerBasic(input).pipe(
			map((res) => res.data?.registerBasic as LoggedUserOutputFragment),
			tap((res) => {
				this.tokenStorageService.setAccessToken(res);
			}),
			switchMap(() => this.authenticationApiService.getAuthenticatedUser()),
			catchError(() => EMPTY)
		);
	}
}
