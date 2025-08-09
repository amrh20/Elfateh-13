import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartCount = 0;
  wishlistCount = 0;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartCount = this.cartService.getTotalItems();
    });

    this.wishlistService.getWishlistItems().subscribe(items => {
      this.wishlistCount = this.wishlistService.getWishlistCount();
    });
  }
} 