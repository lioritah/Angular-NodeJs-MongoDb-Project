import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { UserRegistrationForm } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

type PreRegisterUser = {
  email: string;
  password: string;
  confirmPassword: string;
  passportId: string;
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  preRegisterUser: PreRegisterUser | null = null;

  isValidPreRegister: boolean | undefined;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  preRegisterForm = this.formBuilder.group({
    passportId: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  registerForm = this.formBuilder.group({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    addressStreet: new FormControl('', [Validators.required]),
    addressCity: new FormControl('', [Validators.required]),
  });

  get passportId() {
    return this.registerForm.get('passportId');
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get addressStreet() {
    return this.registerForm.get('addressStreet');
  }

  get addressCity() {
    return this.registerForm.get('addressCity');
  }
  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  isAfterPreRegister() {
    return this.preRegisterUser !== null;
  }

  onSubmitPreRegister() {
    if (!this.preRegisterForm.valid) {
      return;
    }
    // this.registerForm.valid
    const email = this.preRegisterForm.value.email!!;
    const password = this.preRegisterForm.value.password!!;
    const confirmPassword = this.preRegisterForm.value.confirmPassword!!;
    const passportId = this.preRegisterForm.value.passportId!!;

    if (password !== confirmPassword) {
      return alert('Passwords do not match!');
    }

    let subscription = this.authService
      .validate(email, passportId)
      .pipe(
        catchError((err) => {
          this.isValidPreRegister = false;
          return of(false);
        })
      )
      .subscribe((valid) => {
        if (valid) {
          this.preRegisterUser = {
            email,
            password,
            confirmPassword,
            passportId,
          };
        }
        subscription.unsubscribe();
      });
  }

  onSubmitRegister() {
    // this.registerForm.valid
    const firstName = this.registerForm.value.firstName!!;
    const lastName = this.registerForm.value.lastName!!;
    const addressCity = this.registerForm.value.addressCity!!;
    const addressStreet = this.registerForm.value.addressStreet!!;

    const newUser = {
      firstName,
      lastName,
      addressCity,
      addressStreet,
      ...this.preRegisterUser,
    } as UserRegistrationForm;

    let subscription = this.authService
      .register(newUser)
      .subscribe((registerSuccessful) => {
        if (registerSuccessful) {
          this.router.navigate(['auth', 'login']);
        }
        subscription.unsubscribe();
      });
  }
}
