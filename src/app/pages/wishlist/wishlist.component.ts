import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div class="bg-gray-50 min-h-screen py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">المفضلة</h1>

        <div *ngIf="wishlistItems.length > 0">
          <!-- Header -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-semibold text-gray-800">
                  المنتجات المفضلة ({{ wishlistItems.length }})
                </h2>
                <p class="text-gray-600 text-sm mt-1">
                  احفظ المنتجات التي تريدها لشرائها لاحقاً
                </p>
              </div>
              
              <button (click)="clearWishlist()" 
                      class="text-red-600 hover:text-red-700 text-sm font-semibold">
                مسح الكل
              </button>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-12">
            <app-product-card *ngFor="let product of wishlistItems" 
                             [product]="product"
                             (addToCartEvent)="onAddToCart($event)">
            </app-product-card>
          </div>

          <!-- Quick Actions -->
          <div class="mt-12 bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">إجراءات سريعة</h3>
            <div class="flex flex-col sm:flex-row gap-4">
              <button (click)="addAllToCart()" 
                      class="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors">
                إضافة الكل للسلة
              </button>
              <a routerLink="/categories" 
                 class="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors text-center">
                متابعة التسوق
              </a>
            </div>
          </div>
        </div>

        <!-- Empty Wishlist -->
        <div *ngIf="wishlistItems.length === 0" class="text-center py-16">
          <div class="bg-white rounded-lg shadow-md p-12 max-w-md mx-auto">
            <svg class="w-24 h-24 text-gray-400 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
              </path>
            </svg>
            <h2 class="text-2xl font-semibold text-gray-600 mb-4">قائمة المفضلة فارغة</h2>
            <p class="text-gray-500 mb-8">
              لم تقم بإضافة أي منتجات إلى المفضلة بعد. ابدأ بتصفح منتجاتنا وأضف ما يعجبك!
            </p>
            <a routerLink="/categories" 
               class="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition-colors">
              تصفح المنتجات
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.wishlistService.getWishlistItems().subscribe(items => {
      this.wishlistItems = items;
    });
  }

  onAddToCart(product: Product): void {
    // Product added to cart via product card component
  }

  addAllToCart(): void {
    this.wishlistItems.forEach(product => {
      if (product.inStock) {
        this.cartService.addToCart(product);
      }
    });
  }

  clearWishlist(): void {
    if (confirm('هل أنت متأكد من حذف جميع المنتجات من المفضلة؟')) {
      this.wishlistService.clearWishlist();
    }
  }
} 