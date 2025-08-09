export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subCategory?: string;
  brand: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  isOnSale: boolean;
  discountPercentage?: number;
  images: string[];
  specifications?: { [key: string]: string };
  quantity?: number;
}

export interface SubCategory {
  id: number;
  name: string;
  productCount: number;
  products: Product[];
}

export interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
  productCount: number;
  subCategories?: SubCategory[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
}

export interface Order {
  id: string;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate?: Date;
  deliveryAddress: string;
  paymentMethod: 'cash';
  trackingNumber?: string;
} 