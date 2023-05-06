import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ExceptionsService } from 'src/app/services/exceptions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private FormBuilder: FormBuilder,
    private exception: ExceptionsService
  ) {}
  loginForm = this.FormBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmitLogin() {
    const email = this.loginForm.value.email!!;
    const password = this.loginForm.value.password!!;
    this.authService.login(email, password);
  }
}
