import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../Core/Services/auth.service';
import { Router } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  form! : FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  private email!: string  ;
  private resetToken!:string;

  constructor(fb : FormBuilder,
    private authService : AuthService,
    private router : Router) {
    
      this.form = fb.group({
        newPassword:['',[Validators.required, Validators.minLength(6),Validators.pattern(/\d/)]],
        confirmPassword : ['',[Validators.required]]
      }, { validators: this.passwordsMatchValidator })
  }

  ngOnInit(): void {
    this.email = sessionStorage.getItem('resetEmail')! ;
    this.resetToken = sessionStorage.getItem('resetToken')! ;

    if (!this.email || !this.resetToken) {
      this.router.navigate(['/forgot-password']);
    }
  }

  get f() {
    return this.form.controls;
  }

  passwordsMatchValidator(control: AbstractControl) {
    const form = control as FormGroup;
    const password = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;

    if (password && confirm && password !== confirm) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { passwordMismatch: true };
    } else {
      if (form.get('confirmPassword')?.hasError('mismatch')) {
        form.get('confirmPassword')?.setErrors(null);
      }
      return null;
    }
  }

  onSubmit() {
  this.submitted = true;
  this.errorMessage = '';
   this.successMessage = '';

  if (this.form.invalid) return;

  const payload = {
    email: this.email,
    resetToken: this.resetToken,
    newPassword: this.form.value.newPassword,
    confirmPassword: this.form.value.confirmPassword
  };

  this.authService.resetPassword(payload).subscribe({
    next: (res) => {
      if (res.success) {

        this.successMessage = 'Password changed successfully';

        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('resetToken');

         setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);

        
      } else {
        this.errorMessage = res.error || 'Reset password failed';
      }
    },
    error: (err) => {
      this.errorMessage = err.error.error || 'Reset password failed';
    }
  });
}


}
