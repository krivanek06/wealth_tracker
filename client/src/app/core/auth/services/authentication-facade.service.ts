import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { AuthenticationApiService } from '../../api';
import {
	ChangePasswordInput,
	LoggedUserOutputFragment,
	LoginForgotPasswordInput,
	LoginUserInput,
	RegisterUserInput,
	UserAccountType,
	UserFragment,
} from '../../graphql';
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

	getAuthenticatedUser(): Observable<UserFragment> {
		return this.authenticationApiService.getAuthenticatedUser();
	}

	isAuthenticatedUserTestAccount(): boolean {
		return this.authenticationApiService.authenticatedUser.accountType === UserAccountType.Test;
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
			switchMap(() => this.authenticationApiService.getAuthenticatedUser())
		);
	}

	registerBasic(input: RegisterUserInput): Observable<UserFragment> {
		return this.authenticationApiService.registerBasic(input).pipe(
			map((res) => res.data?.registerBasic as LoggedUserOutputFragment),
			tap((res) => {
				this.tokenStorageService.setAccessToken(res);
			}),
			switchMap(() => this.authenticationApiService.getAuthenticatedUser())
		);
	}

	resetPassword(input: LoginForgotPasswordInput): Observable<boolean> {
		return this.authenticationApiService.resetPassword(input).pipe(
			map((res) => !!res.data?.resetPassword),
			catchError(() => EMPTY)
		);
	}

	changePassword(input: ChangePasswordInput): Observable<boolean> {
		return this.authenticationApiService.changePassword(input).pipe(
			map((res) => !!res.data?.changePassword),
			catchError(() => EMPTY)
		);
	}

	removeAccount(): Observable<boolean> {
		return this.authenticationApiService.removeAccount().pipe(
			map((res) => !!res.data?.removeAccount),
			catchError(() => EMPTY)
		);
	}

	resetData(): void {
		// clear graphql cache
		this.apollo.client.resetStore();
		// remove token from local storage
		this.tokenStorageService.setAccessToken(null);
	}
}
