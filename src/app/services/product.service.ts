import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, Category, SubCategory } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
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
    },
    {
      id: 3,
      name: 'منظف حمامات',
      description: 'منظف حمامات قوي يزيل البقع والرواسب بسهولة',
      price: 40,
      originalPrice: 55,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      category: 'منظفات',
      subCategory: 'منظفات حمامات',
      brand: 'ديتول',
      inStock: true,
      rating: 4.7,
      reviews: 156,
      isOnSale: true,
      discountPercentage: 27,
      images: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'
      ],
      specifications: {
        'الحجم': '1 لتر',
        'النوع': 'سائل'
      }
    },
    {
      id: 4,
      name: 'مكنسة كهربائية',
      description: 'مكنسة كهربائية قوية لتنظيف شامل للمنزل',
      price: 899,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      category: 'أدوات منزلية',
      subCategory: 'مكنسات',
      brand: 'إلكترولوكس',
      inStock: true,
      rating: 4.8,
      reviews: 203,
      isOnSale: false,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
      ],
      specifications: {
        'القوة': '2000 وات',
        'النوع': 'مكنسة عادية'
      }
    },
    {
      id: 5,
      name: 'غسالة أطباق',
      description: 'غسالة أطباق حديثة بتقنيات متطورة',
      price: 2499,
      originalPrice: 2999,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      category: 'أدوات منزلية',
      subCategory: 'غسالات',
      brand: 'بوش',
      inStock: true,
      rating: 4.9,
      reviews: 89,
      isOnSale: true,
      discountPercentage: 17,
      images: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'
      ],
      specifications: {
        'السعة': '12 فرد',
        'الطاقة': 'A++'
      }
    },
    {
      id: 6,
      name: 'مكواة بخار',
      description: 'مكواة بخار احترافية لجميع أنواع الأقمشة',
      price: 299,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      category: 'أدوات منزلية',
      subCategory: 'مكاوي',
      brand: 'فيليبس',
      inStock: true,
      rating: 4.3,
      reviews: 67,
      isOnSale: false,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
      ],
      specifications: {
        'القوة': '1800 وات',
        'السعة': '200 مل'
      }
    },
    {
      id: 7,
      name: 'طقم أواني طبخ',
      description: 'طقم أواني طبخ عالية الجودة من الستانلس ستيل',
      price: 599,
      originalPrice: 799,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      category: 'أدوات مطبخ',
      subCategory: 'أواني طبخ',
      brand: 'تيفال',
      inStock: true,
      rating: 4.6,
      reviews: 89,
      isOnSale: true,
      discountPercentage: 25,
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'
      ],
      specifications: {
        'العدد': '5 قطع',
        'المادة': 'ستانلس ستيل',
        'النوع': 'غير لاصق'
      }
    },
    {
      id: 8,
      name: 'خلاط يدوي',
      description: 'خلاط يدوي قوي للعجائن والصلصات',
      price: 199,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      category: 'أدوات مطبخ',
      subCategory: 'أجهزة طبخ',
      brand: 'كينوود',
      inStock: true,
      rating: 4.4,
      reviews: 45,
      isOnSale: false,
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'
      ],
      specifications: {
        'القوة': '300 وات',
        'الملحقات': '3 قطع'
      }
    },
    {
      id: 9,
      name: 'طقم سكاكين',
      description: 'طقم سكاكين احترافية من الفولاذ المقاوم للصدأ',
      price: 349,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      category: 'أدوات مطبخ',
      subCategory: 'أدوات تقطيع',
      brand: 'فيكتورينوكس',
      inStock: true,
      rating: 4.7,
      reviews: 67,
      isOnSale: false,
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'
      ],
      specifications: {
        'العدد': '6 قطع',
        'المادة': 'فولاذ مقاوم للصدأ',
        'الضمان': '5 سنوات'
      }
    },
    {
      id: 10,
      name: 'صينية خبز',
      description: 'صينية خبز من السيليكون المقاوم للحرارة',
      price: 89,
      originalPrice: 120,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      category: 'أدوات مطبخ',
      subCategory: 'أدوات خبز',
      brand: 'سيلكون',
      inStock: true,
      rating: 4.2,
      reviews: 34,
      isOnSale: true,
      discountPercentage: 26,
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'
      ],
      specifications: {
        'الحجم': '30×20 سم',
        'المادة': 'سيليكون',
        'مقاوم للحرارة': 'حتى 220°م'
      }
    }
  ];

  private categories: Category[] = [
    {
      id: 1,
      name: 'منظفات',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      description: 'جميع أنواع المنظفات المنزلية',
      productCount: 3,
      subCategories: [
        { id: 1, name: 'منظفات أرضيات', productCount: 8, products: [] },
        { id: 2, name: 'منظفات أطباق', productCount: 12, products: [] },
        { id: 3, name: 'منظفات حمامات', productCount: 6, products: [] },
        { id: 4, name: 'منظفات عامة', productCount: 10, products: [] }
      ]
    },
    {
      id: 2,
      name: 'أدوات منزلية',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      description: 'الأدوات الكهربائية والمنزلية',
      productCount: 3,
      subCategories: [
        { id: 5, name: 'مكنسات', productCount: 15, products: [] },
        { id: 6, name: 'غسالات', productCount: 9, products: [] },
        { id: 7, name: 'مكاوي', productCount: 7, products: [] },
        { id: 8, name: 'خلاطات', productCount: 5, products: [] },
        { id: 9, name: 'مطاحن', productCount: 4, products: [] }
      ]
    },
    {
      id: 3,
      name: 'أدوات مطبخ',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      description: 'أدوات الطبخ والطهي الاحترافية',
      productCount: 4,
      subCategories: [
        { id: 10, name: 'أواني طبخ', productCount: 12, products: [] },
        { id: 11, name: 'أدوات تقطيع', productCount: 8, products: [] },
        { id: 12, name: 'أجهزة طبخ', productCount: 6, products: [] },
        { id: 13, name: 'أدوات خبز', productCount: 5, products: [] }
      ]
    }
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const filteredProducts = this.products.filter(p => p.category === category);
    return of(filteredProducts);
  }

  getFeaturedProducts(): Observable<Product[]> {
    const featuredProducts = this.products.filter(p => p.rating >= 4.5);
    return of(featuredProducts.slice(0, 4));
  }

  getBestSellers(): Observable<Product[]> {
    const bestSellers = this.products.filter(p => p.reviews >= 100);
    return of(bestSellers.slice(0, 4));
  }

  getOnSaleProducts(): Observable<Product[]> {
    const onSaleProducts = this.products.filter(p => p.isOnSale);
    return of(onSaleProducts.slice(0, 4));
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  searchProducts(query: string): Observable<Product[]> {
    const searchResults = this.products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase())
    );
    return of(searchResults);
  }
} 