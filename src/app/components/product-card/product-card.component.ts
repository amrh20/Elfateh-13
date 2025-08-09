import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCartEvent = new EventEmitter<Product>();

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  get isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.id);
  }

  addToCart(): void {
    if (this.product.inStock) {
      this.cartService.addToCart(this.product);
      this.addToCartEvent.emit(this.product);
    }
  }

  toggleWishlist(): void {
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
  }
} 