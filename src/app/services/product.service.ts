import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Product, Category, SubCategory } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  // Fallback mock products for development/testing
  private fallbackProducts: Product[] = [
  
  ];

  // Fallback mock categories for development/testing
  private fallbackCategories: Category[] = [
    {
      _id: '1',
      name: 'منظفات',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      description: 'جميع أنواع المنظفات المنزلية',
      isActive: true,
      parent: null,
      ancestors: [],
      subcategories: ['1', '2', '3', '4']
    },
    {
      _id: '2',
      name: 'أدوات منزلية',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      description: 'الأدوات الكهربائية والمنزلية',
      isActive: true,
      parent: null,
      ancestors: [],
      subcategories: ['5', '6', '7', '8', '9']
    },
    {
      _id: '3',
      name: 'أدوات مطبخ',
      image: 'https://images.unsplash.com/photo-1556909114-fcd25c85cd64?w=400',
      description: 'أدوات الطبخ والطهي الاحترافية',
      isActive: true,
      parent: null,
      ancestors: [],
      subcategories: ['10', '11', '12', '13']
    }
  ];

  getProducts(): Observable<Product[]> {
    // Try to get products from API first, fallback to mock data
    return this.http.get<any>(`${environment.apiUrl}/products`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.fallbackProducts;
      }),
      catchError(() => {
        console.log('Using fallback products');
        return of(this.fallbackProducts);
      })
    );
  }

  getProductById(id: string | number): Observable<Product | undefined> {
    // Try to get product from API first, fallback to mock data
    return this.http.get<any>(`${environment.apiUrl}/products/${id}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.fallbackProducts.find(p => p._id === id);
      }),
      catchError(() => {
        console.log('Using fallback product');
        return of(this.fallbackProducts.find(p => p._id === id));
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    // Try to get products by category from API first, fallback to mock data
    return this.http.get<any>(`${environment.apiUrl}/products/category/${category}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.fallbackProducts.filter(p => p.category === category);
      }),
      catchError(() => {
        console.log('Using fallback products by category');
        return of(this.fallbackProducts.filter(p => p.category === category));
      })
    );
  }

  getProductsBySubcategory(subcategoryId: string): Observable<Product[]> {
    // Call the subcategory products API endpoint
    return this.http.get<any>(`${environment.apiUrl}/products/subcategory/${subcategoryId}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return [];
      }),
      catchError((err) => {
        console.error('Error loading products for subcategory:', subcategoryId, err);
        return of([]);
      })
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    // Try to get featured products from API first, fallback to mock data
    return this.http.get<any>(`${environment.apiUrl}/products/featured`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.fallbackProducts.filter(p => (p.rating || 0) >= 4.5).slice(0, 4);
      }),
      catchError(() => {
        console.log('Using fallback featured products');
        return of(this.fallbackProducts.filter(p => (p.rating || 0) >= 4.5).slice(0, 4));
      })
    );
  }

  getBestSellers(): Observable<Product[]> {
    // Try to get best sellers from API first, fallback to mock data
    return this.http.get<any>(`${environment.apiUrl}/products/bestsellers`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.fallbackProducts.filter(p => (p.reviews || 0) >= 100).slice(0, 4);
      }),
      catchError(() => {
        console.log('Using fallback best sellers');
        return of(this.fallbackProducts.filter(p => (p.reviews || 0) >= 100).slice(0, 4));
      })
    );
  }

  getOnSaleProducts(): Observable<Product[]> {
    // Try to get on-sale products from API first, fallback to mock data
    return this.http.get<any>(`${environment.apiUrl}/products/onsale`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.fallbackProducts.filter(p => p.isOnSale).slice(0, 4);
      }),
      catchError(() => {
        console.log('Using fallback on-sale products');
        return of(this.fallbackProducts.filter(p => p.isOnSale).slice(0, 4));
      })
    );
  }

  getCategories(): Observable<Category[]> {
    // Try to get categories from API first, fallback to mock data
    return this.http.get<any>(`${environment.apiUrl}/categories`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.fallbackCategories;
      }),
      catchError(() => {
        console.log('Using fallback categories');
        return of(this.fallbackCategories);
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    // Try to search products from API first, fallback to mock data
    return this.http.get<any>(`${environment.apiUrl}/products/search?q=${encodeURIComponent(query)}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.fallbackProducts.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          (p.brand || '').toLowerCase().includes(query.toLowerCase())
        );
      }),
      catchError(() => {
        console.log('Using fallback search');
        return of(this.fallbackProducts.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          (p.brand || '').toLowerCase().includes(query.toLowerCase())
        ));
      })
    );
  }

  // Get products with filters and pagination
  getProductsWithFilters(queryString: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/products?${queryString}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response;
        }
        // Fallback to mock data if API fails
        return {
          success: true,
          data: {
            products: this.fallbackProducts,
            total: this.fallbackProducts.length,
            page: 1,
            limit: 12
          }
        };
      }),
      catchError((err) => {
        console.error('Error loading products with filters:', err);
        // Return fallback data
        return of({
          success: true,
          data: {
            products: this.fallbackProducts,
            total: this.fallbackProducts.length,
            page: 1,
            limit: 12
          }
        });
      })
    );
  }

  // Helper method to clean image URLs from API response
  getCleanImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    
    // Remove data-src wrapper if exists
    if (imageUrl.includes('data-src=')) {
      const match = imageUrl.match(/data-src="([^"]+)"/);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // Remove extra quotes if exists
    if (imageUrl.startsWith('"') && imageUrl.endsWith('"')) {
      return imageUrl.slice(1, -1);
    }
    
    // Remove escaped quotes if exists
    if (imageUrl.includes('\\"')) {
      return imageUrl.replace(/\\"/g, '');
    }
    
    return imageUrl;
  }
} 