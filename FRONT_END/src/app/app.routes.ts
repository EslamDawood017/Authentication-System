import { Routes } from '@angular/router';
import { LandingComponent } from '../pages/landing/landing.component';
import { Component } from '@angular/core';
import { RegisterComponent } from '../auth/register/register.component';
import { LoginComponent } from '../auth/login/login.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { AuthGuard } from '../Core/guards/auth.guard';
import { VerifyOtpComponent } from '../auth/verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from '../auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../auth/reset-password/reset-password.component';

export const routes: Routes = [
    {path : '' , component : LandingComponent},
    {path : 'dashboard' , component : DashboardComponent , canActivate : [AuthGuard]},
    {path : 'verify-otp' , component : VerifyOtpComponent},
    {path : 'forgot-password' , component  :ForgotPasswordComponent},
    {path : 'reset-password' ,component : ResetPasswordComponent},
    {path : 'register' , component:RegisterComponent},
    {path :'login' , component:LoginComponent}

];
