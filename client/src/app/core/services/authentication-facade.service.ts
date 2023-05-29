import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, EMPTY, from, map, Observable, switchMap, tap } from 'rxjs';
import { AuthenticationApiService } from '../api';
import {
	ChangePasswordInput,
	LoggedUserOutputFragment,
	LoginForgotPasswordInput,
	LoginUserInput,
	RegisterUserInput,
	UserAccountType,
	UserFragment,
} from '../graphql';
import { STORAGE_AUTH_ACCESS_TOKEN } from '../models';
import { StorageService } from '../services/storage.service';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationFacadeService extends StorageService<LoggedUserOutputFragment> {
	constructor(private authenticationApiService: AuthenticationApiService, private apollo: Apollo) {
		super(STORAGE_AUTH_ACCESS_TOKEN);
	}

	getAuthenticatedUser(): Observable<UserFragment> {
		return this.authenticationApiService.getAuthenticatedUser();
	}

	isAuthenticatedUserTestAccount(): boolean {
		return this.authenticationApiService.authenticatedUser.accountType === UserAccountType.Test;
	}

	loginSocialMedia(): Observable<UserFragment> {
		return from(this.authenticationApiService.openSocialMediaLogin()).pipe(
			tap((res) => {
				this.setAccessToken(res);
			}),
			switchMap((res) => this.authenticationApiService.getAuthenticatedUser())
		);
	}

	loginUserBasic(input: LoginUserInput): Observable<UserFragment> {
		return this.authenticationApiService.loginUserBasic(input).pipe(
			map((res) => res.data?.loginBasic as LoggedUserOutputFragment),
			tap((res) => {
				this.setAccessToken(res);
			}),
			switchMap(() => this.authenticationApiService.getAuthenticatedUser())
		);
	}

	registerBasic(input: RegisterUserInput): Observable<UserFragment> {
		return this.authenticationApiService.registerBasic(input).pipe(
			map((res) => res.data?.registerBasic as LoggedUserOutputFragment),
			tap((res) => {
				this.setAccessToken(res);
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
		this.setAccessToken(null);
	}

	getToken(): LoggedUserOutputFragment | null {
		return this.getData();
	}

	setAccessToken(token: LoggedUserOutputFragment | null): void {
		if (token) {
			this.saveData(token);
		} else {
			this.removeData();
		}
	}
}
