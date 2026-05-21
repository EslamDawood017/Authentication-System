import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Core/Services/auth.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-verify-otp',
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent implements OnInit {

  form!: FormGroup;
  email!: string;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

   ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email')|| '';

    if (!this.email) {
          this.router.navigate(['/forgot-password']);
        }
   }

   get f() {
    return this.form.controls;
  }

    onSubmit() {

      this.submitted = true;
      this.errorMessage = '';

      if (this.form.invalid) return;

      this.authService.verifyOtp({email: this.email, otp: this.form.value.otp }).subscribe({
        next: (result) => {
           
          sessionStorage.setItem('resetToken', result.resetToken);
          sessionStorage.setItem('resetEmail', this.email);
          setTimeout(() => {
            this.router.navigate(['/reset-password']);
          }, 2000);
          
        },
        error: (err) => {
          console.log(err);
          this.errorMessage =
            err.error || 'Invalid or expired OTP';
        }
      });

    }
}
