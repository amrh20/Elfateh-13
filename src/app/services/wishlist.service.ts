import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: Product[] = [];
  private wishlistSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    this.loadWishlistFromStorage();
  }

  getWishlistItems(): Observable<Product[]> {
    return this.wishlistSubject.asObservable();
  }

  getWishlistItemsValue(): Product[] {
    return this.wishlistItems;
  }

  addToWishlist(product: Product): void {
    if (!this.isInWishlist(product.id)) {
      this.wishlistItems.push(product);
      this.updateWishlist();
    }
  }

  removeFromWishlist(productId: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
    this.updateWishlist();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.some(item => item.id === productId);
  }

  clearWishlist(): void {
    this.wishlistItems = [];
    this.updateWishlist();
  }

  getWishlistCount(): number {
    return this.wishlistItems.length;
  }

  private updateWishlist(): void {
    this.wishlistSubject.next([...this.wishlistItems]);
    this.saveWishlistToStorage();
  }

  private saveWishlistToStorage(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
  }

  private loadWishlistFromStorage(): void {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlistItems = JSON.parse(savedWishlist);
      this.wishlistSubject.next([...this.wishlistItems]);
    }
  }
} 