import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, inject, isDevMode, NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Auth, connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, Firestore, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogServiceModule } from './shared/dialogs';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatSnackBarModule,
		DialogServiceModule,
		HttpClientModule,
		MatNativeDateModule,
		MatDatepickerModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: !isDevMode() && !Capacitor.isNativePlatform(),
			// Register the ServiceWorker as soon as the application is stable
			registrationStrategy: 'registerImmediately',
		}),
		provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
		provideFirestore(() => getFirestore()),
		provideAuth(() => getAuth()),
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			multi: true,
			deps: [Firestore, Auth],
			useFactory: () => {
				const localhost = '127.0.0.1';

				const firestore = inject(Firestore);
				const auth = inject(Auth);

				return () => {
					if (!environment.production) {
						console.log('%c[Firebase]: Connect to emulator', 'color: #bada55; font-size: 16px;');
						connectFirestoreEmulator(firestore, localhost, 8080);
						connectAuthEmulator(auth, `http://${localhost}:9099`);
					}
				};
			},
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
