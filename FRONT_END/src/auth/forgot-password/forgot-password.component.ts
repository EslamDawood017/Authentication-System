import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Core/Services/auth.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  form!: FormGroup;
  submitted = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.form.controls;
  }

   onSubmit() {
    this.submitted = true;

    if (this.form.invalid) return;

    this.authService.forgotPassword(this.form.value.email)
      .subscribe({
        next: (res) => {
          this.message = res.message;

          // Redirect to OTP page
          setTimeout(() => {
            this.router.navigate(['/verify-otp'], {
              queryParams: { email: this.form.value.email }
            });
          }, 4000);
        }
      });
  }


}
