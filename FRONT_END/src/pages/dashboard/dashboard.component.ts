import { Component, OnInit } from '@angular/core';
import { Product } from '../../Core/Models/Product';
import { ProductService } from '../../Core/Services/product.service';
import { NgFor, NgIf } from '@angular/common';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-dashboard',
  imports: [NgIf, NgFor, NavComponent ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res.products;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load products';
        this.loading = false;
      },
    });
  }
}
