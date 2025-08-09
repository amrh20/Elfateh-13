import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, Category, SubCategory } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">الأصناف والمنتجات</h1>
          <p class="text-gray-600 max-w-2xl mx-auto">
            تصفح مجموعتنا الواسعة من المنظفات والأدوات المنزلية عالية الجودة
          </p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Categories Menu -->
          <div class="lg:w-80 flex-shrink-0">
            <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 class="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
                الأصناف
              </h2>
              
              <!-- Search in Categories -->
              <div class="mb-6">
                <input type="text" 
                       [(ngModel)]="categorySearch"
                       placeholder="البحث في الأصناف..."
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300">
              </div>

              <!-- Categories List -->
              <div class="space-y-2">
                <div *ngFor="let category of filteredCategories" 
                     class="category-item">
                  
                  <!-- Main Category -->
                  <button (click)="toggleCategory(category.id)"
                          [class.active]="selectedCategoryId === category.id"
                          class="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 group">
                    <div class="flex items-center space-x-3 space-x-reverse">
                      <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors duration-300">
                        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
                          </path>
                        </svg>
                      </div>
                      <div class="text-right">
                        <h3 class="font-semibold text-gray-800 group-hover:text-red-600 transition-colors duration-300">
                          {{ category.name }}
                        </h3>
                        <p class="text-sm text-gray-500">{{ category.productCount }} منتج</p>
                      </div>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 transition-transform duration-300"
                         [class.rotate-180]="selectedCategoryId === category.id"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  <!-- Subcategories Dropdown -->
                  <div *ngIf="selectedCategoryId === category.id" 
                       class="mt-2 space-y-1 pr-4 animate-fade-in-down">
                    <div *ngFor="let subCategory of category.subCategories" 
                         (click)="selectSubCategory(subCategory)"
                         [class.active]="selectedSubCategoryId === subCategory.id"
                         class="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 cursor-pointer transition-all duration-300 group">
                      <div class="flex items-center space-x-3 space-x-reverse">
                        <div class="w-2 h-2 bg-red-400 rounded-full group-hover:bg-red-600 transition-colors duration-300"></div>
                        <span class="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors duration-300">
                          {{ subCategory.name }}
                        </span>
                      </div>
                      <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {{ subCategory.productCount }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Clear Filters Button -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <button (click)="clearAllFilters()"
                        class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium">
                  مسح الفلاتر
                </button>
              </div>
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1">
            <!-- Current Selection Header -->
            <div *ngIf="selectedCategoryId || selectedSubCategoryId" 
                 class="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    {{ getCurrentSelectionName() }}
                  </h2>
                  <p class="text-gray-600">
                    {{ getCurrentSelectionCount() }} منتج متاح
                  </p>
                </div>
                <div class="flex items-center space-x-4 space-x-reverse">
                  <button (click)="clearAllFilters()"
                          class="text-red-600 hover:text-red-700 transition-colors font-medium">
                    عرض الكل
                  </button>
                </div>
              </div>
            </div>

            <!-- Products Filters -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div class="flex items-center space-x-4 space-x-reverse">
                  <span class="text-gray-700 font-semibold">تصفية المنتجات:</span>
                </div>
                
                <div class="flex items-center space-x-4 space-x-reverse">
                  <input type="text" 
                         [(ngModel)]="productSearch"
                         (input)="onProductSearch()"
                         placeholder="البحث في المنتجات..."
                         class="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300">
                  
                  <select [(ngModel)]="sortBy" (change)="onSort()" 
                          class="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300">
                    <option value="">ترتيب حسب</option>
                    <option value="price-low">السعر: من الأقل للأعلى</option>
                    <option value="price-high">السعر: من الأعلى للأقل</option>
                    <option value="rating">التقييم</option>
                    <option value="name">الاسم</option>
                    <option value="newest">الأحدث</option>
                  </select>
                </div>
              </div>
            </div>

                         <!-- Products Grid -->
             <div *ngIf="filteredProducts.length > 0">
               <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-12">
                 <app-product-card *ngFor="let product of filteredProducts" 
                                  [product]="product"
                                  (addToCartEvent)="onAddToCart($event)">
                 </app-product-card>
               </div>
             </div>

            <!-- No Products Found -->
            <div *ngIf="filteredProducts.length === 0" 
                 class="text-center py-16 bg-white rounded-2xl shadow-lg">
              <svg class="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                </path>
              </svg>
              <h3 class="text-2xl font-semibold text-gray-600 mb-3">لا توجد منتجات</h3>
              <p class="text-gray-500 mb-6">جرب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
              <button (click)="clearAllFilters()"
                      class="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-300 font-medium">
                عرض جميع المنتجات
              </button>
            </div>

                         <!-- All Products (when no category selected) -->
             <div *ngIf="!selectedCategoryId && !selectedSubCategoryId && !productSearch">
               <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
                 <h2 class="text-2xl font-bold text-gray-800 mb-4">جميع المنتجات</h2>
                 <p class="text-gray-600">تصفح جميع منتجاتنا المميزة</p>
               </div>
               
               <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-12">
                 <app-product-card *ngFor="let product of allProducts" 
                                  [product]="product"
                                  (addToCartEvent)="onAddToCart($event)">
                 </app-product-card>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .category-item .active {
      background-color: #fef2f2;
      border: 2px solid #dc2626;
    }
    
    .category-item .active h3 {
      color: #dc2626;
    }
    
    .subcategory-item .active {
      background-color: #fef2f2;
      border: 1px solid #dc2626;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategoryId: number | null = null;
  selectedSubCategoryId: number | null = null;
  categorySearch: string = '';
  productSearch: string = '';
  sortBy: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      // Add subcategories to each category
      this.categories = categories.map(category => ({
        ...category,
        subCategories: this.generateSubCategories(category)
      }));
    });
  }

  generateSubCategories(category: Category): SubCategory[] {
    // Generate mock subcategories based on the main category
    const subCategories: SubCategory[] = [];
    
    switch (category.name) {
      case 'منظفات':
        subCategories.push(
          { id: 1, name: 'منظفات الأرضيات', productCount: 8, products: [] },
          { id: 2, name: 'منظفات المطبخ', productCount: 12, products: [] },
          { id: 3, name: 'منظفات الحمام', productCount: 6, products: [] },
          { id: 4, name: 'منظفات الزجاج', productCount: 4, products: [] },
          { id: 5, name: 'منظفات الملابس', productCount: 10, products: [] }
        );
        break;
      case 'أدوات منزلية':
        subCategories.push(
          { id: 6, name: 'أدوات المطبخ', productCount: 15, products: [] },
          { id: 7, name: 'أدوات التنظيف', productCount: 9, products: [] },
          { id: 8, name: 'أدوات الحمام', productCount: 7, products: [] },
          { id: 9, name: 'أدوات الغسيل', productCount: 5, products: [] }
        );
        break;
      case 'منتجات العناية':
        subCategories.push(
          { id: 10, name: 'منتجات العناية بالبشرة', productCount: 8, products: [] },
          { id: 11, name: 'منتجات العناية بالشعر', productCount: 6, products: [] },
          { id: 12, name: 'منتجات العناية الشخصية', productCount: 10, products: [] }
        );
        break;
      default:
        subCategories.push(
          { id: 13, name: 'منتجات عامة', productCount: 5, products: [] }
        );
    }
    
    return subCategories;
  }

  loadAllProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
      this.filteredProducts = products;
    });
  }

  get filteredCategories(): Category[] {
    if (!this.categorySearch) return this.categories;
    
    return this.categories.filter(category =>
      category.name.toLowerCase().includes(this.categorySearch.toLowerCase()) ||
      category.subCategories?.some(sub => 
        sub.name.toLowerCase().includes(this.categorySearch.toLowerCase())
      ) || false
    );
  }

  toggleCategory(categoryId: number): void {
    if (this.selectedCategoryId === categoryId) {
      this.selectedCategoryId = null;
      this.selectedSubCategoryId = null;
    } else {
      this.selectedCategoryId = categoryId;
      this.selectedSubCategoryId = null;
    }
    this.applyFilters();
  }

  selectSubCategory(subCategory: SubCategory): void {
    this.selectedSubCategoryId = subCategory.id;
    this.applyFilters();
  }

  onProductSearch(): void {
    this.applyFilters();
  }

  onSort(): void {
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.selectedCategoryId = null;
    this.selectedSubCategoryId = null;
    this.categorySearch = '';
    this.productSearch = '';
    this.sortBy = '';
    this.filteredProducts = [...this.allProducts];
  }

  getCurrentSelectionName(): string {
    if (this.selectedSubCategoryId) {
      const category = this.categories.find(c => c.subCategories?.some(s => s.id === this.selectedSubCategoryId));
      const subCategory = category?.subCategories?.find(s => s.id === this.selectedSubCategoryId);
      return subCategory?.name || '';
    }
    if (this.selectedCategoryId) {
      const category = this.categories.find(c => c.id === this.selectedCategoryId);
      return category?.name || '';
    }
    return '';
  }

  getCurrentSelectionCount(): number {
    return this.filteredProducts.length;
  }

  applyFilters(): void {
    let filtered = [...this.allProducts];

    // Category filter
    if (this.selectedCategoryId) {
      const category = this.categories.find(c => c.id === this.selectedCategoryId);
      if (category) {
        filtered = filtered.filter(product => product.category === category.name);
      }
    }

    // Subcategory filter (mock implementation)
    if (this.selectedSubCategoryId) {
      // In a real app, you would filter by subcategory
      // For now, we'll just show a subset of products
      filtered = filtered.slice(0, Math.floor(filtered.length * 0.7));
    }

    // Product search filter
    if (this.productSearch) {
      const query = this.productSearch.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    }

    // Sort
    if (this.sortBy) {
      switch (this.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'newest':
          filtered.sort((a, b) => b.id - a.id);
          break;
      }
    }

    this.filteredProducts = filtered;
  }

  onAddToCart(product: Product): void {
    // Product added to cart via product card component
  }
} 