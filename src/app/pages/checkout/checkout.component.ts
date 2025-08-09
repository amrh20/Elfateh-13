import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="bg-gray-50 min-h-screen py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">إتمام الطلب</h1>

        <div *ngIf="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Checkout Form -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-6">معلومات التوصيل</h2>
              
              <form (ngSubmit)="placeOrder()" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل *</label>
                    <input type="text" [(ngModel)]="deliveryInfo.fullName" name="fullName" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">رقم الموبايل *</label>
                    <input type="tel" [(ngModel)]="deliveryInfo.phone" name="phone" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">عنوان التوصيل *</label>
                  <textarea [(ngModel)]="deliveryInfo.address" name="address" required rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="أدخل العنوان بالتفصيل"></textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">المدينة *</label>
                    <input type="text" [(ngModel)]="deliveryInfo.city" name="city" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">الرمز البريدي</label>
                    <input type="text" [(ngModel)]="deliveryInfo.postalCode" name="postalCode"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ملاحظات إضافية</label>
                  <textarea [(ngModel)]="deliveryInfo.notes" name="notes" rows="2"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="أي ملاحظات إضافية للتوصيل"></textarea>
                </div>
              </form>
            </div>

            <!-- Payment Method -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-6">طريقة الدفع</h2>
              
              <div class="space-y-4">
                <label class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" [(ngModel)]="paymentMethod" value="cash" name="paymentMethod" checked
                         class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300">
                  <div class="mr-3">
                    <div class="flex items-center">
                      <svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
                        </path>
                      </svg>
                      <span class="font-medium text-gray-800">الدفع عند الاستلام</span>
                    </div>
                    <p class="text-gray-600 text-sm mt-1">ادفع نقداً عند استلام طلبك</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-6">ملخص الطلب</h2>
              
              <!-- Order Items -->
              <div class="space-y-4 mb-6">
                <div *ngFor="let item of cartItems" class="flex items-center space-x-3 space-x-reverse">
                  <img [src]="item.product.image" [alt]="item.product.name" 
                       class="w-12 h-12 object-cover rounded-md">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-800 text-sm">{{ item.product.name }}</h4>
                    <p class="text-gray-600 text-sm">الكمية: {{ item.quantity }}</p>
                  </div>
                  <span class="font-semibold text-gray-800">{{ getItemPrice(item) }} ج.م</span>
                </div>
              </div>
              
              <!-- Totals -->
              <div class="border-t border-gray-200 pt-4 space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">المجموع الفرعي:</span>
                  <span class="font-semibold">{{ subtotal }} ج.م</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">الخصم:</span>
                  <span class="font-semibold text-green-600">-{{ discount }} ج.م</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">رسوم التوصيل:</span>
                  <span class="font-semibold">{{ deliveryFee }} ج.م</span>
                </div>
                
                <div class="border-t border-gray-200 pt-3">
                  <div class="flex justify-between">
                    <span class="text-lg font-semibold text-gray-800">المجموع الكلي:</span>
                    <span class="text-xl font-bold text-red-600">{{ total }} ج.م</span>
                  </div>
                </div>
              </div>

              <!-- Place Order Button -->
              <button (click)="placeOrder()" 
                      [disabled]="isLoading || !isFormValid()"
                      class="w-full bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6">
                {{ isLoading ? 'جاري إتمام الطلب...' : 'إتمام الطلب' }}
              </button>

              <div class="mt-4 text-center">
                <a routerLink="/cart" 
                   class="text-red-600 hover:text-red-700 text-sm">
                  العودة للسلة
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
          <p class="text-gray-500 mb-8">لا يمكن إتمام الطلب بدون منتجات في السلة</p>
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
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading: boolean = false;
  paymentMethod: string = 'cash';
  
  deliveryInfo = {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  };

  subtotal = 0;
  discount = 0;
  deliveryFee = 20;
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
    this.total = this.cartService.getTotalPrice() + this.deliveryFee;
  }

  getItemPrice(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  isFormValid(): boolean {
    return !!(this.deliveryInfo.fullName && 
              this.deliveryInfo.phone && 
              this.deliveryInfo.address && 
              this.deliveryInfo.city);
  }

  placeOrder(): void {
    if (!this.isFormValid()) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      // Create order object
      const order = {
        id: 'ORD-' + Date.now(),
        items: this.cartItems,
        totalAmount: this.total,
        deliveryInfo: this.deliveryInfo,
        paymentMethod: this.paymentMethod,
        orderDate: new Date(),
        status: 'pending'
      };

      // Clear cart
      this.cartService.clearCart();

      // Navigate to order confirmation
      this.router.navigate(['/track-order'], { 
        queryParams: { orderId: order.id } 
      });
    }, 2000);
  }
} 