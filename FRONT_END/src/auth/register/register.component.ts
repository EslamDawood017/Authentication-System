import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Core/Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [NgIf , ReactiveFormsModule , NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  
  registerForm!: FormGroup;
  submitted = false;
  errorMessage : string = '';
  successMessage : string = '';

  constructor(private fb: FormBuilder , private authService : AuthService ,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6) , Validators.pattern(/\d/) ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  //convenience getter for easy access to form fields
  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log('Form Data', this.registerForm.value);
      
       const { username, email, password } = this.registerForm.value;
      // send data to API here

      this.authService.register({ username, email, password }).subscribe({
        next: (res) => {
          if (res.success) {

            this.successMessage = 'Registered successfully';

            setTimeout(() => {
               this.router.navigate(['/login']);
             }, 2000);
            }
          else {
            this.errorMessage = res.errors ? res.errors.join(', ') : 'Registration failed';
          }
        },
        error: (err) => {
          console.error('HTTP error:', err);
          this.errorMessage = err.error.errors ? err.error.errors.join(', ') : 'Registration failed zzzzzz';;
        }
      });
        }
  }

}
