import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Core/Services/auth.service';
import { TokenService } from '../../Core/Services/token.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router , 
    private tokenService : TokenService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

   get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login({ username, password }).subscribe({
      next: (res) => {
        if (res.success && res.accessToken && res.refreshToken) {

          this.tokenService.saveTokens(res.accessToken, res.refreshToken);
          this.router.navigate(['/dashboard']); // redirect after login
        
        } 
        else {
          this.errorMessage = res.errors ? res.errors.join(', ') : 'Login failed';
        }
      },
      error: (err) => {
        this.errorMessage =  err.error.errors.join(', ') ;
      }
    });
  }
}
