import { Injectable, computed, signal } from '@angular/core';
import { FirebaseAuthentication, User } from '@capacitor-firebase/authentication';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginUserInput, RegisterUserInput } from '../models/authentication.model';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationAccountService {
	private authUserSignal = signal<User | null>(null);
	private loadedAuthentication$ = new BehaviorSubject<boolean>(false);

	isUserNew = computed(
		() => this.authUserSignal()?.metadata?.creationTime == this.authUserSignal()?.metadata?.lastSignInTime
	);
	getCurrentUser = computed(() => this.authUserSignal());
	getCurrentUserMust = computed(() => this.authUserSignal()!);

	constructor() {
		FirebaseAuthentication.addListener('authStateChange', (change) => {
			console.log('Auth state change', change);
			this.authUserSignal.set(change.user);
			this.loadedAuthentication$.next(true);
		});

		// fallback if user goes to the app but not logged in
		setTimeout(() => {
			this.loadedAuthentication$.next(true);
		}, 1000);
	}

	getLoadedAuthentication(): Observable<boolean> {
		return this.loadedAuthentication$.asObservable();
	}

	async signIn(input: LoginUserInput): Promise<void> {
		await FirebaseAuthentication.signInWithEmailAndPassword({
			email: input.email,
			password: input.password,
		});
	}

	async register(input: RegisterUserInput): Promise<void> {
		await FirebaseAuthentication.createUserWithEmailAndPassword({
			email: input.email,
			password: input.password,
		});
	}

	async removeAccount(): Promise<void> {
		const user = await FirebaseAuthentication.getCurrentUser();
		if (user) {
			FirebaseAuthentication.deleteUser();
		}
	}

	async signInGoogle(): Promise<void> {
		const result = await FirebaseAuthentication.signInWithGoogle();
		console.log('result', result);
	}

	async signOut(): Promise<void> {
		await FirebaseAuthentication.signOut();
	}

	async changePassword(oldPassword: string, newPassword: string): Promise<void> {
		const currentUser = this.getCurrentUser();

		if (!currentUser?.email) {
			throw new Error('User is not authenticated');
		}

		try {
			await FirebaseAuthentication.updatePassword({
				newPassword: newPassword,
			});
		} catch (error) {
			console.error(error);
			throw new Error('Old password is incorrect');
		}
	}
}
