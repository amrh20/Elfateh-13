import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Product, Category, SubCategory } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  // Fallback mock products for development/testing
  private fallbackProducts: Product[] = [
    {
      id: 1,
      name: 'منظف أرضيات لافندر',
      description: 'منظف أرضيات عالي الجودة برائحة اللافندر المنعشة، مناسب لجميع أنواع الأرضيات',
      price: 45,
      originalPrice: 60,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      category: 'منظفات',
      subCategory: 'منظفات أرضيات',
      brand: 'فريش',
      inStock: true,
      rating: 4.5,
      reviews: 128,
      isOnSale: true,
      discountPercentage: 25,
      images: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'
      ],
      specifications: {
        'الحجم': '1 لتر',
        'الرائحة': 'لافندر',
        'النوع': 'سائل'
      }
    },
    {
      id: 2,
      name: 'سائل غسيل الأطباق',
      description: 'سائل غسيل أطباق فعال يزيل الدهون بسهولة ويحمي يديك',
      price: 35,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      category: 'منظفات',
      subCategory: 'منظفات أطباق',
      brand: 'فيري',
      inStock: true,
      rating: 4.2,
      reviews: 95,
      isOnSale: false,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
      ],
      specifications: {
        'الحجم': '750 مل',
        'النوع': 'سائل'
      }
    }
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
    return this.http.get<any>('/products').pipe(
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

  getProductById(id: number): Observable<Product | undefined> {
    // Try to get product from API first, fallback to mock data
    return this.http.get<any>(`/products/${id}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.fallbackProducts.find(p => p.id === id);
      }),
      catchError(() => {
        console.log('Using fallback product');
        return of(this.fallbackProducts.find(p => p.id === id));
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    // Try to get products by category from API first, fallback to mock data
    return this.http.get<any>(`/products/category/${category}`).pipe(
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
    return this.http.get<any>(`/products/subcategory/${subcategoryId}`).pipe(
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
    return this.http.get<any>('/products/featured').pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.fallbackProducts.filter(p => p.rating >= 4.5).slice(0, 4);
      }),
      catchError(() => {
        console.log('Using fallback featured products');
        return of(this.fallbackProducts.filter(p => p.rating >= 4.5).slice(0, 4));
      })
    );
  }

  getBestSellers(): Observable<Product[]> {
    // Try to get best sellers from API first, fallback to mock data
    return this.http.get<any>('/products/bestsellers').pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.fallbackProducts.filter(p => p.reviews >= 100).slice(0, 4);
      }),
      catchError(() => {
        console.log('Using fallback best sellers');
        return of(this.fallbackProducts.filter(p => p.reviews >= 100).slice(0, 4));
      })
    );
  }

  getOnSaleProducts(): Observable<Product[]> {
    // Try to get on-sale products from API first, fallback to mock data
    return this.http.get<any>('/products/onsale').pipe(
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
    return this.http.get<any>('/categories').pipe(
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
    return this.http.get<any>(`/products/search?q=${encodeURIComponent(query)}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.fallbackProducts.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
        );
      }),
      catchError(() => {
        console.log('Using fallback search');
        return of(this.fallbackProducts.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
        ));
      })
    );
  }
} 