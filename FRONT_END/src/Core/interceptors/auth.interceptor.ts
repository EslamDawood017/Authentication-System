import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { TokenService } from '../Services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    debugger
    const accessToken = this.tokenService.getAccessToken();

    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  } 

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (this.isRefreshing) {
      return throwError(() => new Error('Token refresh in progress'));
    }

    this.isRefreshing = true;

    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.authService.refreshToken(refreshToken).pipe(
      switchMap(response => {
        this.isRefreshing = false;

        this.tokenService.saveTokens(
          response.accessToken,
          response.refreshToken
        );

        return next.handle(
          this.addToken(request, response.accessToken)
        );
      }),
      catchError(err => {
        this.isRefreshing = false;
        this.logout();
        return throwError(() => err);
      })
    );
  }

  private logout() {
    this.tokenService.clearTokens();
    this.router.navigate(['/auth/login']);
  }

}
