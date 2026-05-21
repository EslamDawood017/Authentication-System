import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../Core/Services/token.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [NgIf],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  isLoginedIn: boolean = false;
  isScrolled: boolean = false;

  constructor(
    public router: Router,
    private tokenService: TokenService
  ) {
    this.isLoginedIn = tokenService.isLoggedIn();
  }

  ngOnInit(): void {
    this.checkScroll();
  }



  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }

  Logout(): void {
    this.tokenService.clearTokens();
    this.isLoginedIn = false;
    this.router.navigate(['']);
  }
}
