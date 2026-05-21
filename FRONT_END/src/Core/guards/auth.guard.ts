import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../Services/token.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(): boolean {

    const token = this.tokenService.getAccessToken();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    if (this.isTokenExpired(token)) {
      this.tokenService.clearTokens();
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // exp is in seconds
      return Date.now() >= expiry;
    } catch {
      return true; // invalid token
    }
  }
}