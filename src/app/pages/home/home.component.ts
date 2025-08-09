import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Product, Category, Order } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { register } from 'swiper/element/bundle';

// Register Swiper elements
register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

  // Data loading methods
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

  loadCurrentOrder(): void {
    this.orderService.getCurrentOrder().subscribe(order => {
      this.currentOrder = order;
    });
  }

  onAddToCart(product: Product): void {
    // Product added to cart via product card component
    console.log('Product added to cart:', product.name);
  }
} 