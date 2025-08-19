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
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  parent: string;
  ancestors: string[];
  products: Product[];
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  description: string;
  isActive: boolean;
  parent: string | null;
  ancestors: string[];
  subcategories: string[];
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