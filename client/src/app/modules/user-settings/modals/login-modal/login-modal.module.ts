import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { LoginModalComponent } from './login-modal.component';

@NgModule({
	declarations: [LoginModalComponent],
	imports: [CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule, MatIconModule, MatDividerModule],
	exports: [LoginModalComponent],
})
export class LoginModalModule {}
