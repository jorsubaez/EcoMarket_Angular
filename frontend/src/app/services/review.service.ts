import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Review {
  id: number;
  user: number;
  userName: string;
  product: number;
  productName: string;
  producerName: string;
  rating: number;
  comment: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:8000/api/reviews/';

  constructor(private http: HttpClient) {}

  getReviewsByProduct(productId: number): Promise<Review[]> {
    return firstValueFrom(this.http.get<Review[]>(`${this.apiUrl}?product=${productId}`));
  }

  createReview(productId: number, rating: number, comment: string): Promise<Review> {
    return firstValueFrom(
      this.http.post<Review>(this.apiUrl, {
        product: productId,
        rating,
        comment,
      }),
    );
  }
}
