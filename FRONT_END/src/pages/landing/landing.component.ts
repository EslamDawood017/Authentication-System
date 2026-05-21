import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-landing',
  imports: [NavComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  
  constructor(private router : Router) {}

  ngOnInit(): void {
    
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
  onRegister() {
    this.router.navigate(['/register']);
  }
    
}
