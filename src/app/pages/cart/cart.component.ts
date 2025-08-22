import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalItems = 0;
  subtotal = 0;
  discount = 0;
  total = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.totalItems = this.cartService.getTotalItems();
    
    // Calculate subtotal (original prices)
    this.subtotal = this.cartItems.reduce((sum, item) => {
      const originalPrice = item.product.originalPrice || item.product.price;
      return sum + (originalPrice * item.quantity);
    }, 0);

    // Calculate discount
    this.discount = this.cartItems.reduce((sum, item) => {
      if (item.product.originalPrice) {
        const savings = (item.product.originalPrice - item.product.price) * item.quantity;
        return sum + savings;
      }
      return sum;
    }, 0);

    // Calculate total
    this.total = this.cartService.getTotalPrice();
  }

  getItemPrice(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  proceedToCheckout(): void {
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
  }
} 