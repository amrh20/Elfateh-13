import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Product, Category, Order } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <!-- Hero Section -->
    <section class="bg-gradient-hero text-white py-24 relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div class="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-float" style="animation-delay: 1s;"></div>
        <div class="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style="animation-delay: 2s;"></div>
      </div>
      
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1 class="text-5xl md:text-7xl font-black mb-8 animate-fade-in-up">
          الفتح للأدوات المنزلية
        </h1>
        <p class="text-xl md:text-2xl mb-12 max-w-3xl mx-auto animate-fade-in-up" style="animation-delay: 200ms;">
          أفضل المنظفات والأدوات المنزلية بأسعار منافسة وجودة عالية
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style="animation-delay: 400ms;">
          <a routerLink="/categories" 
             class="btn-primary text-lg px-10 py-4 rounded-2xl font-bold btn-animate">
            تصفح المنتجات
          </a>
          <a routerLink="/track-order" 
             class="btn-outline text-lg px-10 py-4 rounded-2xl font-bold btn-animate border-white text-white hover:bg-white hover:text-red-600">
            تتبع طلبك
          </a>
        </div>
      </div>
    </section>

    <!-- Current Order Section -->
    <section *ngIf="currentOrder" class="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
      <div class="container mx-auto px-4">
        <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-blue-100">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">طلبك الحالي</h2>
                <p class="text-gray-600">رقم الطلب: {{ currentOrder.id }}</p>
              </div>
            </div>
            <div class="text-left">
              <span [class]="'px-4 py-2 rounded-full text-sm font-medium ' + orderService.getOrderStatusColor(currentOrder.status)">
                {{ orderService.getOrderStatusText(currentOrder.status) }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-900">المنتجات المطلوبة</h3>
              <div class="space-y-3">
                <div *ngFor="let item of currentOrder.items" class="flex items-center space-x-3 space-x-reverse bg-gray-50 rounded-lg p-3">
                  <img [src]="item.product.image" [alt]="item.product.name" class="w-12 h-12 rounded-lg object-cover">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">{{ item.product.name }}</h4>
                    <p class="text-sm text-gray-600">الكمية: {{ item.quantity }}</p>
                  </div>
                  <div class="text-left">
                    <p class="font-semibold text-gray-900">{{ (item.product.price * item.quantity).toFixed(2) }} ج.م</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-900">تفاصيل الطلب</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">إجمالي المبلغ:</span>
                  <span class="font-semibold text-gray-900">{{ currentOrder.totalAmount.toFixed(2) }} ج.م</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">تاريخ الطلب:</span>
                  <span class="text-gray-900">{{ currentOrder.orderDate | date:'dd/MM/yyyy' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">موعد التوصيل:</span>
                  <span class="text-gray-900">{{ currentOrder.deliveryDate | date:'dd/MM/yyyy' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">طريقة الدفع:</span>
                  <span class="text-gray-900">{{ currentOrder.paymentMethod === 'cash' ? 'نقداً' : 'بطاقة ائتمان' }}</span>
                </div>
                <div *ngIf="currentOrder.trackingNumber" class="flex justify-between">
                  <span class="text-gray-600">رقم التتبع:</span>
                  <span class="font-mono text-blue-600">{{ currentOrder.trackingNumber }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a [routerLink]="['/track-order']" 
               class="btn-primary px-6 py-3 rounded-lg font-medium text-center">
              تتبع الطلب بالتفصيل
            </a>
            <a [routerLink]="['/profile']" 
               class="btn-outline px-6 py-3 rounded-lg font-medium text-center border-gray-300 text-gray-700 hover:bg-gray-50">
              عرض جميع الطلبات
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div class="container mx-auto px-4">
        <h2 class="heading-2 text-center mb-16 animate-fade-in-up">الأصناف الرئيسية</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let category of categories; let i = index" 
               class="card card-hover animate-fade-in-up" [style.animation-delay]="i * 200 + 'ms'">
            <div class="relative overflow-hidden">
              <img [src]="category.image" [alt]="category.name" 
                   class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-bold mb-3 text-gray-800 group-hover:text-red-600 transition-colors duration-300">{{ category.name }}</h3>
              <p class="text-gray-600 mb-6 body-text">{{ category.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{{ category.productCount }} منتج</span>
                <a [routerLink]="['/categories']" 
                   class="btn-primary btn-animate">
                  تصفح
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="heading-2 text-center mb-16 animate-fade-in-up">المنتجات المميزة</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-12">
          <app-product-card *ngFor="let product of featuredProducts; let i = index" 
                           [product]="product"
                           (addToCartEvent)="onAddToCart($event)"
                           class="animate-fade-in-up" [style.animation-delay]="i * 100 + 'ms'">
          </app-product-card>
        </div>
      </div>
    </section>

    <!-- Best Sellers -->
    <section class="py-20 bg-gradient-to-b from-white to-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="heading-2 text-center mb-16 animate-fade-in-up">الأكثر مبيعاً</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-12">
          <app-product-card *ngFor="let product of bestSellers; let i = index" 
                           [product]="product"
                           (addToCartEvent)="onAddToCart($event)"
                           class="animate-fade-in-up" [style.animation-delay]="i * 100 + 'ms'">
          </app-product-card>
        </div>
      </div>
    </section>

    <!-- Offers Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="heading-2 text-center mb-16 animate-fade-in-up">العروض الخاصة</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-12">
          <app-product-card *ngFor="let product of onSaleProducts; let i = index" 
                           [product]="product"
                           (addToCartEvent)="onAddToCart($event)"
                           class="animate-fade-in-up" [style.animation-delay]="i * 100 + 'ms'">
          </app-product-card>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-20 bg-gradient-hero text-white relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-1/4 left-10 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
        <div class="absolute bottom-1/4 right-10 w-24 h-24 bg-white/5 rounded-full animate-float" style="animation-delay: 1.5s;"></div>
      </div>
      
      <div class="container mx-auto px-4 relative z-10">
        <h2 class="heading-2 text-center mb-16 animate-fade-in-up">لماذا تختار الفتح؟</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="text-center animate-fade-in-up" style="animation-delay: 200ms;">
            <div class="bg-white/20 backdrop-blur-sm rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z">
                </path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4">جودة عالية</h3>
            <p class="text-lg opacity-90">نختار أفضل المنتجات من أشهر الماركات العالمية</p>
          </div>
          
          <div class="text-center animate-fade-in-up" style="animation-delay: 400ms;">
            <div class="bg-white/20 backdrop-blur-sm rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
                </path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4">أسعار منافسة</h3>
            <p class="text-lg opacity-90">أفضل الأسعار مع عروض وخصومات مستمرة</p>
          </div>
          
          <div class="text-center animate-fade-in-up" style="animation-delay: 600ms;">
            <div class="bg-white/20 backdrop-blur-sm rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13 10V3L4 14h7v7l9-11h-7z">
                </path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4">توصيل سريع</h3>
            <p class="text-lg opacity-90">توصيل سريع وآمن لجميع أنحاء المدينة</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  bestSellers: Product[] = [];
  onSaleProducts: Product[] = [];
  currentOrder: Order | null = null;

  constructor(
    private productService: ProductService,
    public orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
    this.loadBestSellers();
    this.loadOnSaleProducts();
    this.loadCurrentOrder();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts().subscribe(products => {
      this.featuredProducts = products;
    });
  }

  loadBestSellers(): void {
    this.productService.getBestSellers().subscribe(products => {
      this.bestSellers = products;
    });
  }

  loadOnSaleProducts(): void {
    this.productService.getOnSaleProducts().subscribe(products => {
      this.onSaleProducts = products;
    });
  }

  onAddToCart(product: Product): void {
    // Product added to cart via product card component
  }

  loadCurrentOrder(): void {
    this.orderService.getCurrentOrder().subscribe(order => {
      this.currentOrder = order;
    });
  }
} 