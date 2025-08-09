import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="bg-gray-50 min-h-screen py-8" *ngIf="product">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <nav class="mb-8">
          <ol class="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <li><a routerLink="/home" class="hover:text-red-600">الرئيسية</a></li>
            <li>/</li>
            <li><a routerLink="/categories" class="hover:text-red-600">الأصناف</a></li>
            <li>/</li>
            <li><a [routerLink]="['/categories']" class="hover:text-red-600">{{ product.category }}</a></li>
            <li>/</li>
            <li class="text-gray-800">{{ product.name }}</li>
          </ol>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Product Images -->
          <div class="space-y-4">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <img [src]="selectedImage" [alt]="product.name" 
                   class="w-full h-96 object-cover">
            </div>
            
            <!-- Thumbnail Images -->
            <div class="flex space-x-2 space-x-reverse overflow-x-auto">
              <img *ngFor="let image of product.images; let i = index" 
                   [src]="image" [alt]="product.name + ' ' + (i + 1)"
                   (click)="selectedImage = image"
                   [class.border-red-600]="selectedImage === image"
                   class="w-20 h-20 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-red-600 transition-colors">
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ product.name }}</h1>
              <p class="text-gray-600 text-lg">{{ product.description }}</p>
            </div>

            <!-- Rating -->
            <div class="flex items-center space-x-2 space-x-reverse">
              <div class="flex text-yellow-400">
                <svg *ngFor="let star of [1,2,3,4,5]" class="w-5 h-5" 
                     [class.text-yellow-400]="star <= product.rating" 
                     [class.text-gray-300]="star > product.rating"
                     fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z">
                  </path>
                </svg>
              </div>
              <span class="text-gray-600">({{ product.reviews }} تقييم)</span>
              <span class="text-gray-400">|</span>
              <span class="text-gray-600">العلامة التجارية: {{ product.brand }}</span>
            </div>

            <!-- Price -->
            <div class="space-y-2">
              <div class="flex items-center space-x-4 space-x-reverse">
                <span class="text-3xl font-bold text-red-600">{{ product.price }} ج.م</span>
                <span *ngIf="product.originalPrice" 
                      class="text-xl text-gray-500 line-through">{{ product.originalPrice }} ج.م</span>
                <span *ngIf="product.isOnSale" 
                      class="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {{ product.discountPercentage }}% خصم
                </span>
              </div>
            </div>

            <!-- Stock Status -->
            <div class="flex items-center space-x-2 space-x-reverse">
              <div [class]="product.inStock ? 'text-green-600' : 'text-red-600'">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path *ngIf="product.inStock" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z">
                  </path>
                  <path *ngIf="!product.inStock" 
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z">
                  </path>
                </svg>
              </div>
              <span [class]="product.inStock ? 'text-green-600' : 'text-red-600'">
                {{ product.inStock ? 'متوفر في المخزون' : 'غير متوفر حالياً' }}
              </span>
            </div>

            <!-- Quantity and Actions -->
            <div class="space-y-4">
              <div class="flex items-center space-x-4 space-x-reverse">
                <label class="text-gray-700 font-semibold">الكمية:</label>
                <div class="flex items-center border border-gray-300 rounded-md">
                  <button (click)="decreaseQuantity()" 
                          [disabled]="quantity <= 1"
                          class="px-3 py-2 hover:bg-gray-100 disabled:opacity-50">
                    -
                  </button>
                  <input type="number" [(ngModel)]="quantity" min="1" 
                         class="w-16 text-center border-none focus:outline-none">
                  <button (click)="increaseQuantity()" 
                          class="px-3 py-2 hover:bg-gray-100">
                    +
                  </button>
                </div>
              </div>

              <div class="flex space-x-4 space-x-reverse">
                <button (click)="addToCart()" 
                        [disabled]="!product.inStock"
                        class="flex-1 bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                  {{ product.inStock ? 'أضف للسلة' : 'غير متوفر' }}
                </button>
                
                <button (click)="toggleWishlist()" 
                        [class.text-red-600]="isInWishlist"
                        [class.text-gray-400]="!isInWishlist"
                        class="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                    </path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Specifications -->
            <div *ngIf="product.specifications" class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">المواصفات</h3>
              <div class="space-y-2">
                <div *ngFor="let spec of getSpecifications()" 
                     class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">{{ spec.key }}</span>
                  <span class="text-gray-800 font-medium">{{ spec.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="!product" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p class="text-gray-600">جاري التحميل...</p>
      </div>
    </div>
  `,
  styles: []
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  selectedImage: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(productId: number): void {
    this.productService.getProductById(productId).subscribe(product => {
      this.product = product;
      if (product && product.images.length > 0) {
        this.selectedImage = product.images[0];
      }
    });
  }

  get isInWishlist(): boolean {
    return this.product ? this.wishlistService.isInWishlist(this.product.id) : false;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product && this.product.inStock) {
      this.cartService.addToCart(this.product, this.quantity);
      // Show success message or redirect to cart
    }
  }

  toggleWishlist(): void {
    if (this.product) {
      if (this.isInWishlist) {
        this.wishlistService.removeFromWishlist(this.product.id);
      } else {
        this.wishlistService.addToWishlist(this.product);
      }
    }
  }

  getSpecifications(): { key: string; value: string }[] {
    if (!this.product?.specifications) return [];
    return Object.entries(this.product.specifications).map(([key, value]) => ({
      key,
      value
    }));
  }
} 