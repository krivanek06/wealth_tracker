import { Injectable, computed, signal } from '@angular/core';
import { FirebaseAuthentication, User } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
import { initializeApp } from 'firebase/app';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginUserInput, RegisterUserInput } from '../models/authentication.model';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationAccountService {
	private authUserSignal = signal<User | null>(null);
	private loadedAuthentication$ = new Subject<User['uid'] | null>();

	isUserNew = computed(
		() => this.authUserSignal()?.metadata?.creationTime == this.authUserSignal()?.metadata?.lastSignInTime
	);
	getCurrentUser = computed(() => this.authUserSignal());
	getCurrentUserMust = computed(() => this.authUserSignal()!);

	constructor() {
		if (!Capacitor.isNativePlatform()) {
			initializeApp(environment.firebaseConfig);
		}

		FirebaseAuthentication.removeAllListeners();

		FirebaseAuthentication.addListener('authStateChange', (change) => {
			console.log('change', change);
			this.authUserSignal.set(change.user);
			this.loadedAuthentication$.next(change.user?.uid ?? null);
		});
	}

	getLoadedAuthentication(): Observable<User['uid'] | null> {
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

	removeAccount(): void {
		if (this.authUserSignal()) {
			FirebaseAuthentication.deleteUser();
		}
	}

	async signInGoogle(): Promise<void> {
		await FirebaseAuthentication.signInWithGoogle();
	}

	signOut() {
		FirebaseAuthentication.signOut();
	}
}
