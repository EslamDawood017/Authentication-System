import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../Models/Product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/Product`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(this.apiUrl);
  }
}
