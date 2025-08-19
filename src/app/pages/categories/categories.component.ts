import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { Product, Category, SubCategory } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule, ProductCardComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategoryId: string | null = null;
  selectedSubCategoryId: string | null = null;
  categorySearch: string = '';
  productSearch: string = '';
  sortBy: string = '';
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    // Don't load all products initially
    // this.loadAllProducts();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;
    
    // Call the categories API endpoint
    this.http.get<any>(`${environment.apiUrl}/categories`).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
          console.log('Categories loaded:', this.categories);
          console.log('First category subcategories:', this.categories[0]?.subcategories);
        } else {
          this.error = 'Failed to load categories';
        }
        this.loading = false;
        // Auto-select first subcategory after categories load
        this.autoSelectFirstSubcategory();
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Error loading categories. Please try again.';
        this.loading = false;
        
        // Fallback to mock data if API fails
        this.loadMockCategories();
        // Auto-select first subcategory after mock data loads
        this.autoSelectFirstSubcategory();
      }
    });
  }

  loadMockCategories(): void {
    // Fallback mock data structure matching the API response
    this.categories = [
      {
        _id: '1',
        name: 'منظفات',
        description: 'منتجات تنظيف عالية الجودة',
        image: 'assets/images/cleaners.jpg',
        isActive: true,
        parent: null,
        ancestors: [],
        subcategories: ['1', '2', '3', '4', '5']
      },
      {
        _id: '2',
        name: 'أدوات منزلية',
        description: 'أدوات منزلية متنوعة',
        image: 'assets/images/home-tools.jpg',
        isActive: true,
        parent: null,
        ancestors: [],
        subcategories: ['6', '7', '8', '9']
      },
      {
        _id: '3',
        name: 'منتجات العناية',
        description: 'منتجات العناية الشخصية',
        image: 'assets/images/care-products.jpg',
        isActive: true,
        parent: null,
        ancestors: [],
        subcategories: ['10', '11', '12']
      }
    ];
  }

  autoSelectFirstSubcategory(): void {
    // Don't auto-select anything - let user choose manually
    this.selectedCategoryId = null;
    this.selectedSubCategoryId = null;
    console.log('No auto-selection - waiting for user input');
  }

  loadAllProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
      this.filteredProducts = products;
    });
  }

  loadProductsBySubcategory(subCategoryId: string): void {
    this.loading = true;
    this.error = null;
    
    // Call the subcategory products API endpoint
    this.http.get<any>(`${environment.apiUrl}/products/subcategory/${subCategoryId}`).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.filteredProducts = response.data;
          console.log('Products loaded for subcategory:', subCategoryId, response.data);
        } else {
          this.error = 'Failed to load products for this subcategory';
          this.filteredProducts = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products for subcategory:', subCategoryId, err);
        this.error = 'Error loading products. Please try again.';
        this.filteredProducts = [];
        this.loading = false;
        
        // Fallback to filtering from all products
        this.applyFilters();
      }
    });
  }

  loadProductsByCategory(categoryId: string): void {
    this.loading = true;
    this.error = null;
    
    // For main category, we'll filter from all products or call a category API if available
    const category = this.categories.find(c => c._id === categoryId);
    if (category) {
      // Filter products by category name from all products
      this.filteredProducts = this.allProducts.filter(product => 
        product.category === category.name
      );
      console.log('Products filtered for category:', category.name, this.filteredProducts);
    }
    this.loading = false;
  }

  get filteredCategories(): Category[] {
    let filtered = this.categories;
    
    // Filter by search term if provided
    if (this.categorySearch) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(this.categorySearch.toLowerCase()) ||
        category.description.toLowerCase().includes(this.categorySearch.toLowerCase())
      );
    }
    
    // Only show categories that have subcategories
    filtered = filtered.filter(category => 
      category.subcategories && category.subcategories.length > 0
    );
    
    return filtered;
  }

  toggleCategory(categoryId: string): void {
    if (this.selectedCategoryId === categoryId) {
      // إذا كانت مفتوحة، نغلقها
      this.selectedCategoryId = null;
      this.selectedSubCategoryId = null;
      this.filteredProducts = []; // Don't load all products
    } else {
      // نفتح الفئة الجديدة
      this.selectedCategoryId = categoryId;
      this.selectedSubCategoryId = null;
      this.filteredProducts = []; // Clear products when opening category
      // لا نحمل منتجات هنا، فقط نفتح Subcategories
    }
  }

  selectSubCategory(subCategoryId: any): void {
    // Ensure we have a string ID, not an object
    const id = typeof subCategoryId === 'object' ? subCategoryId._id || subCategoryId.id : subCategoryId;
    console.log('SubCategory selected:', { subCategoryId, id, type: typeof subCategoryId });
    
    this.selectedSubCategoryId = id;
    this.loadProductsBySubcategory(id);
  }

  onProductSearch(): void {
    this.loading = false;
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
    this.filteredProducts = []; // Don't load all products
    this.loading = false;
    this.error = null;
  }

  getCurrentSelectionName(): string {
    if (this.selectedSubCategoryId) {
      return this.getSubCategoryName(this.selectedSubCategoryId);
    }
    if (this.selectedCategoryId) {
      const category = this.categories.find(c => c._id === this.selectedCategoryId);
      return category?.name || '';
    }
    return '';
  }

  getCurrentSelectionCount(): number {
    return this.filteredProducts.length;
  }

  getSubCategoryName(subCategory: any): string {
    // Handle both string IDs and object references
    const id = typeof subCategory === 'object' ? subCategory._id || subCategory.id : subCategory;
    
    // Mock subcategory names - in real app, you'd fetch this from API
    const subCategoryNames: { [key: string]: string } = {
      '1': 'منظفات الأرضيات',
      '2': 'منظفات المطبخ',
      '3': 'منظفات الحمام',
      '4': 'منظفات الزجاج',
      '5': 'منظفات الملابس',
      '6': 'أدوات المطبخ',
      '7': 'أدوات التنظيف',
      '8': 'أدوات الحمام',
      '9': 'أدوات الغسيل',
      '10': 'منتجات العناية بالبشرة',
      '11': 'منتجات العناية بالشعر',
      '12': 'منتجات العناية الشخصية'
    };
    return subCategoryNames[id] || 'فئة فرعية';
  }

  getSubCategoryProductCount(subCategory: any): number {
    // Handle both string IDs and object references
    const id = typeof subCategory === 'object' ? subCategory._id || subCategory.id : subCategory;
    
    // Mock product counts - in real app, you'd fetch this from API
    const subCategoryCounts: { [key: string]: number } = {
      '1': 8,
      '2': 12,
      '3': 6,
      '4': 4,
      '5': 10,
      '6': 15,
      '7': 9,
      '8': 7,
      '9': 5,
      '10': 8,
      '11': 6,
      '12': 10
    };
    return subCategoryCounts[id] || 0;
  }

  // Helper method to safely extract subcategory ID
  getSubCategoryId(subCategory: any): string {
    return typeof subCategory === 'object' ? subCategory._id || subCategory.id : subCategory;
  }

  applyFilters(): void {
    let filtered = [...this.allProducts];

    // Category filter
    if (this.selectedCategoryId) {
      const category = this.categories.find(c => c._id === this.selectedCategoryId);
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
    console.log('Product added to cart:', product);
  }
}