import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../Models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:59980/api/Product';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ products:Product[] }> {
    return this.http.get<{ products: Product[] }>(this.apiUrl);
  }
}