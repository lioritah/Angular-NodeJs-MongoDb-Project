import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, of, share } from 'rxjs';
import { User, UserRegistrationForm } from '../models/user.model';
import { CartService } from './cart.service';
import { ExceptionsService } from './exceptions.service';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  user = new BehaviorSubject<User | null>(null);

  isAdmin = new BehaviorSubject<boolean>(false);
  isLogged = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private exceptionService: ExceptionsService,
    private popUpService: PopupService,
    private cartService: CartService,
    private router: Router
  ) {
    this.token.subscribe((token) => {
      if (token) {
        localStorage.setItem('token', token);
        this.getUser();
      }
    });
  }

  getUser() {
    let sub = this.httpClient
      .get<User | null>('auth')
      .pipe(catchError((err) => of(null)))
      .subscribe((user) => {
        this.user.next(user);
        sub.unsubscribe();
      });
  }

  register(newUser: UserRegistrationForm) {
    return this.httpClient.post<boolean>('auth', newUser).pipe(
      catchError((err) => {
        this.exceptionService.handleError(err);
        return of(false);
      }),
      share()
    );
  }

  validate(email: string, passportId: string) {
    return this.httpClient
      .post<boolean>('auth/validateNewUser', { email, passportId })
      .pipe(share());
  }

  login(email: string, password: string) {
    this.httpClient
      .post<string | null>('auth/login', { email, password })
      .pipe(
        catchError((err) => {
          this.exceptionService.handleError(err);
          return of(null);
        }),
        share()
      )
      .subscribe((token) => {
        this.token.next(token);
      });
  }

  logout() {
    this.user.next(null);
    this.token.next(null);
    localStorage.removeItem('token');
    this.router.navigate(['auth', 'login']);
    this.cartService.$orderComplete.next(null);
    this.cartService.$cartItems.next([]);

    // if log out was used through popup service
    if (this.popUpService.showingLogoutRequest)
      this.popUpService.hideLogoutRequest();
  }
}
