import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RegisterPayload } from '../Models/RegisterPayload ';
import { RegisterResponse } from '../Models/RegisterResponse';
import { LoginPayload } from '../Models/LoginPayload';
import { LoginResponse } from '../Models/LoginResponse ';
import { Router } from '@angular/router';
import { OtpVerification } from '../Models/OtpVerification';
import { ResetPasswordRequest } from '../Models/ResetPasswordRequest';
import { ResetPasswordResponse } from '../Models/ResetPasswordResponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl;

  refreshTokenApi = `${this.baseUrl}/api/Auth/refresh-token`;
  registerApi = `${this.baseUrl}/api/Auth/register`;
  LoginApi = `${this.baseUrl}/api/Auth/login`;
  ForgetPassword = `${this.baseUrl}/api/Auth/forgot-password`;
  OtpVerificationApi = `${this.baseUrl}/api/Auth/verify-otp`;
  resetPasswordApi = `${this.baseUrl}/api/Auth/reset-password`;

  constructor(
    private tokenService: TokenService,
    private http: HttpClient,
    private router: Router,
  ) {}

  register(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.registerApi, payload);
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.LoginApi, payload);
  }

  logout() {
    this.tokenService.clearTokens();
    this.router.navigate(['/login']);
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.ForgetPassword, {
      email: email,
    });
  }

  refreshToken(
    refreshToken: string,
  ): Observable<{ accessToken: string; refreshToken: string }> {
    const payload = { refreshToken: refreshToken };

    return this.http
      .post<{
        accessToken: string;
        refreshToken: string;
      }>(this.refreshTokenApi, payload)
      .pipe(
        map((response) => {
          return {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          };
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  verifyOtp(OtpVerification: OtpVerification) {
    return this.http.post<any>(this.OtpVerificationApi, OtpVerification);
  }

  resetPassword(
    payload: ResetPasswordRequest,
  ): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      this.resetPasswordApi,
      payload,
    );
  }
}
