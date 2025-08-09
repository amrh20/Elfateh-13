import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-gray-50 min-h-screen py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">سلة التسوق</h1>

        <div *ngIf="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cart Items -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-md">
              <div class="p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-800">المنتجات ({{ totalItems }})</h2>
              </div>
              
              <div class="divide-y divide-gray-200">
                <div *ngFor="let item of cartItems" class="p-6">
                  <div class="flex items-center space-x-4 space-x-reverse">
                    <!-- Product Image -->
                    <img [src]="item.product.image" [alt]="item.product.name" 
                         class="w-20 h-20 object-cover rounded-md">
                    
                    <!-- Product Info -->
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-800 mb-1">
                        {{ item.product.name }}
                      </h3>
                      <p class="text-gray-600 text-sm mb-2">{{ item.product.brand }}</p>
                      
                      <!-- Price -->
                      <div class="flex items-center space-x-2 space-x-reverse">
                        <span class="text-lg font-bold text-red-600">
                          {{ getItemPrice(item) }} ج.م
                        </span>
                        <span *ngIf="item.product.originalPrice" 
                              class="text-sm text-gray-500 line-through">
                          {{ item.product.originalPrice * item.quantity }} ج.م
                        </span>
                      </div>
                    </div>

                    <!-- Quantity Controls -->
                    <div class="flex items-center space-x-2 space-x-reverse">
                      <button (click)="updateQuantity(item.product.id, item.quantity - 1)" 
                              [disabled]="item.quantity <= 1"
                              class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
                        -
                      </button>
                      <span class="w-12 text-center font-semibold">{{ item.quantity }}</span>
                      <button (click)="updateQuantity(item.product.id, item.quantity + 1)" 
                              class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50">
                        +
                      </button>
                    </div>

                    <!-- Remove Button -->
                    <button (click)="removeFromCart(item.product.id)" 
                            class="text-red-600 hover:text-red-700 p-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-6">ملخص الطلب</h2>
              
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">عدد المنتجات:</span>
                  <span class="font-semibold">{{ totalItems }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">المجموع الفرعي:</span>
                  <span class="font-semibold">{{ subtotal }} ج.م</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">الخصم:</span>
                  <span class="font-semibold text-green-600">-{{ discount }} ج.م</span>
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                  <div class="flex justify-between">
                    <span class="text-lg font-semibold text-gray-800">المجموع الكلي:</span>
                    <span class="text-xl font-bold text-red-600">{{ total }} ج.م</span>
                  </div>
                </div>
              </div>

              <button (click)="proceedToCheckout()" 
                      class="w-full bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition-colors mt-6">
                إتمام الطلب
              </button>

              <div class="mt-4 text-center">
                <a routerLink="/categories" 
                   class="text-red-600 hover:text-red-700 text-sm">
                  متابعة التسوق
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Cart -->
        <div *ngIf="cartItems.length === 0" class="text-center py-16">
          <svg class="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01">
            </path>
          </svg>
          <h2 class="text-2xl font-semibold text-gray-600 mb-4">سلة التسوق فارغة</h2>
          <p class="text-gray-500 mb-8">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
          <a routerLink="/categories" 
             class="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition-colors">
            تصفح المنتجات
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalItems = 0;
  subtotal = 0;
  discount = 0;
  total = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.totalItems = this.cartService.getTotalItems();
    
    // Calculate subtotal (original prices)
    this.subtotal = this.cartItems.reduce((sum, item) => {
      const originalPrice = item.product.originalPrice || item.product.price;
      return sum + (originalPrice * item.quantity);
    }, 0);

    // Calculate discount
    this.discount = this.cartItems.reduce((sum, item) => {
      if (item.product.originalPrice) {
        const savings = (item.product.originalPrice - item.product.price) * item.quantity;
        return sum + savings;
      }
      return sum;
    }, 0);

    // Calculate total
    this.total = this.cartService.getTotalPrice();
  }

  getItemPrice(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  proceedToCheckout(): void {
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
  }
} 