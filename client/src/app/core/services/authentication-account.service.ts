import { Injectable, computed, inject, signal } from '@angular/core';
import {
	Auth,
	EmailAuthProvider,
	GoogleAuthProvider,
	User,
	UserCredential,
	createUserWithEmailAndPassword,
	reauthenticateWithCredential,
	signInWithEmailAndPassword,
	signInWithPopup,
	updatePassword,
} from '@angular/fire/auth';
import { LoginUserInput, RegisterUserInput } from '../models/authentication.model';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationAccountService {
	private auth = inject(Auth);
	private authUserSignal = signal<User | null>(null);

	isUserNew = computed(
		() => this.authUserSignal()?.metadata?.creationTime == this.authUserSignal()?.metadata?.lastSignInTime
	);
	getCurrentUser = computed(() => this.authUserSignal());
	getCurrentUserMust = computed(() => this.authUserSignal()!);

	constructor() {
		this.auth.onAuthStateChanged((user) => {
			console.log('Auth change', user);
			this.authUserSignal.set(user);
		});
	}

	signIn(input: LoginUserInput): Promise<UserCredential> {
		return signInWithEmailAndPassword(this.auth, input.email, input.password);
	}

	register(input: RegisterUserInput): Promise<UserCredential> {
		return createUserWithEmailAndPassword(this.auth, input.email, input.password);
	}

	removeAccount(): void {
		if (this.auth.currentUser) {
			this.auth.currentUser.delete();
		}
	}

	signInGoogle(): Promise<UserCredential> {
		const provider = new GoogleAuthProvider();
		return signInWithPopup(this.auth, provider);
	}

	signOut() {
		this.auth.signOut();
	}

	async changePassword(oldPassword: string, newPassword: string): Promise<void> {
		const currentUser = this.getCurrentUser();
		if (!currentUser?.email) {
			throw new Error('User is not authenticated');
		}

		try {
			// check if old password is correct
			const credentials = EmailAuthProvider.credential(currentUser.email, oldPassword);
			console.log('credentials', credentials);
			const reauth = await reauthenticateWithCredential(currentUser, credentials);
			console.log('reauth', reauth);
		} catch (error) {
			console.error(error);
			throw new Error('Old password is incorrect');
		}

		try {
			await updatePassword(currentUser, newPassword);
		} catch (error) {
			console.error(error);
			throw new Error('Password change failed');
		}
	}

	async deleteAccount(): Promise<void> {
		// TODO
	}
}
