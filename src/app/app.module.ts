import { HttpClientModule } from '@angular/common/http';
import { APP_ID, isDevMode, NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
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
			enabled: !isDevMode(),
			// Register the ServiceWorker as soon as the application is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: 'registerImmediately',
		}),
		provideFirebaseApp(() =>
			initializeApp({
				projectId: 'wealth-tracker-d2757',
				appId: '1:721049469654:web:cc1d0e3ccff91180607f77',
				storageBucket: 'wealth-tracker-d2757.appspot.com',
				apiKey: 'AIzaSyCF5EIL2kMhlvJAR7a6qJTXUi3tTmOoA8M',
				authDomain: 'wealth-tracker-d2757.firebaseapp.com',
				messagingSenderId: '721049469654',
				measurementId: 'G-CM0D3TJEXS',
			})
		),
		provideAuth(() => getAuth()),
		provideFirestore(() => getFirestore()),
	],
	providers: [{ provide: APP_ID, useValue: 'serverApp' }],
	bootstrap: [AppComponent],
})
export class AppModule {}
