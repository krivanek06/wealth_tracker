import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
