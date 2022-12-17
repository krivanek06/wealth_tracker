import { Injectable } from '@angular/core';
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
		private authenticationApiService: AuthenticationApiService
	) {}

	getAuthenticatedUser(): Observable<UserFragment | null> {
		if (!!this.tokenStorageService.getAccessToken()) {
			return of(null);
		}

		return this.authenticationApiService.getAuthenticatedUser();
	}

	logoutUser(): void {
		this.tokenStorageService.setAccessToken(null);
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
