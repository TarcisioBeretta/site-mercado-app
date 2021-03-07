import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ILoginResponse } from 'src/app/services/login/login-response.interface';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  title = '';
  loading = false;

  form = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private matSnackBar: MatSnackBar,
    private router: Router
  ) { }

  submit(): void {
    const { username, password } = this.form.value;

    this.loginService
      .login(username, password)
      .subscribe(
        data => this.onSubmitSuccess(data),
        error => this.onSubmitError(error),
      );
  }

  private onSubmitSuccess(loginResponse: ILoginResponse): void {
    if (loginResponse.success) {
      this.router.navigate(['produtos']);
    } else {
      if (loginResponse.error) {
        this.openSnackBar(loginResponse.error);
      }
    }
  }

  private onSubmitError(errorResponse: HttpErrorResponse): void {
    this.openSnackBar(errorResponse.error);
  }

  private openSnackBar(text: string): void {
    this.matSnackBar.open(text, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
