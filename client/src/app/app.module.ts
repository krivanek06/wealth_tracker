import { HttpClientModule } from '@angular/common/http';
import { APP_ID, isDevMode, NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './core/graphql';
import { DialogServiceModule } from './shared/dialogs';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatSnackBarModule,
		DialogServiceModule,
		GraphQLModule,
		HttpClientModule,
		MatNativeDateModule,
		MatDatepickerModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: !isDevMode(),
			// Register the ServiceWorker as soon as the application is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: 'registerImmediately',
		}),
	],
	providers: [{ provide: APP_ID, useValue: 'serverApp' }],
	bootstrap: [AppComponent],
})
export class AppModule {}
