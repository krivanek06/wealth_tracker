import { Injectable, inject } from '@angular/core';
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
import { Firestore } from '@angular/fire/firestore';
import { LoginUserInput, RegisterUserInput } from '../models/authentication.model';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationAccountService {
	private firestore = inject(Firestore);
	private auth = inject(Auth);

	constructor() {
		this.auth.onAuthStateChanged((user) => {
			console.log('Auth change', user);
		});
	}

	get currentUser(): User | null {
		return this.auth.currentUser;
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
		if (!this.currentUser?.email) {
			throw new Error('User is not authenticated');
		}

		try {
			// check if old password is correct
			const credentials = EmailAuthProvider.credential(this.currentUser.email, oldPassword);
			console.log('credentials', credentials);
			const reauth = await reauthenticateWithCredential(this.currentUser, credentials);
			console.log('reauth', reauth);
		} catch (error) {
			console.error(error);
			throw new Error('Old password is incorrect');
		}

		try {
			await updatePassword(this.currentUser, newPassword);
		} catch (error) {
			console.error(error);
			throw new Error('Password change failed');
		}
	}

	changePhotoUrl(photoURL: string): void {
		// this.updateUser(this.currentUserData.id, {
		//   personal: {
		//     ...this.currentUserData.personal,
		//     photoURL,
		//   },
		// });
	}

	async deleteAccount(): Promise<void> {
		// TODO
	}

	// private listenOnUserChanges(): void {
	//   this.authenticatedUser$
	//     .pipe(
	//       switchMap((user) =>
	//         this.getUserById(user?.uid).pipe(
	//           switchMap((userData) => (userData ? of(userData) : user ? from(this.userCreateAccount()) : of(null))),
	//         ),
	//       ),
	//     )
	//     .subscribe((userData) => {
	//       console.log('UPDATING USER', userData);
	//       // update user data
	//       this.authenticatedUserData$.next(userData);

	//       // notify about user change
	//       const value = userData && !!userData.personal ? userData.id : null;
	//       this.loadedAuthentication$.next(value);
	//     });
	// }

	// private getUserById(userId?: string): Observable<UserData | undefined> {
	//   if (!userId) {
	//     return of(undefined);
	//   }
	//   return rxDocData(this.getUserDocRef(userId), { idField: 'id' });
	// }

	// private updateUser(id: string, user: Partial<UserData>): void {
	//   setDoc(this.getUserDocRef(id), user, { merge: true });
	// }

	// private getUserDocRef(userId: string): DocumentReference<UserData> {
	//   return doc(this.userCollection(), userId);
	// }

	// private userCollection(): CollectionReference<UserData, DocumentData> {
	//   return collection(this.firestore, 'users').withConverter(assignTypesClient<UserData>());
	// }
}
