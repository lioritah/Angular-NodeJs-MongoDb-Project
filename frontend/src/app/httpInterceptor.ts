import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, of, share } from 'rxjs';
import { ExceptionsService } from './services/exceptions.service';

export function get<T>(
  route: string,
  client: HttpClient,
  exceptions: ExceptionsService
): Observable<T | null> {
  return client.get<T>(route).pipe(
    catchError((err) => {
      console.log(err);
      return of(null);
    }),
    share()
  );
}

export function post<T>(
  route: string,
  data: any,
  client: HttpClient,
  exceptions: ExceptionsService
): Observable<T | null> {
  return client.post<T>(route, data).pipe(
    catchError((err) => {
      console.log(err);
      return of(null);
    }),
    share()
  );
}

export function getSubscribe<T>(
  route: string,
  client: HttpClient,
  exceptions: ExceptionsService
): Promise<T> {
  return new Promise((resolve, reject) => {
    let sub = client
      .get<T>(route)
      .pipe(
        catchError((err) => {
          console.log(err);
          reject();
          return of(null);
        }),
        share()
      )
      .subscribe((data) => {
        sub.unsubscribe();
        if (data) {
          resolve(data);
        }
        reject();
      });
  });
}

export function postSubscribe<T>(
  route: string,
  data: any,
  client: HttpClient,
  exceptions: ExceptionsService
): Promise<T> {
  return new Promise((resolve, reject) => {
    let sub = client
      .post<T>(route, data)
      .pipe(
        catchError((err) => {
          console.log(err);
          reject(err);
          return of(null);
        }),
        share()
      )
      .subscribe((data) => {
        sub.unsubscribe();
        if (data) {
          return resolve(data);
        }
        reject();
      });
  });
}

export class MyInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token');

    req = req.clone({
      url: 'http://localhost:80/api/' + req.url,
      setHeaders: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
    return next.handle(req);
  }
}
