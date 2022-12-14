import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { AuthenticationApiService } from '../../api';
import { LoggedUserOutputFragment, LoginUserInput, RegisterUserInput, UserFragment } from '../../graphql';
import { TokenStorageService } from './token-storage.service';
import { UserStorageService } from './user-storage.service';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationFacadeService {
	constructor(
		private tokenStorageService: TokenStorageService,
		private userStorageService: UserStorageService,
		private authenticationApiService: AuthenticationApiService
	) {}

	loginUserBasic(input: LoginUserInput): Observable<UserFragment> {
		return this.authenticationApiService.loginUserBasic(input).pipe(
			map((res) => res.data?.loginBasic as LoggedUserOutputFragment),
			tap(console.log),
			map((res) => res.user)
		);
	}

	registerBasic(input: RegisterUserInput): Observable<UserFragment> {
		return this.authenticationApiService.registerBasic(input).pipe(
			map((res) => res.data?.registerBasic as LoggedUserOutputFragment),
			tap(console.log),
			map((res) => res.user)
		);
	}
}
