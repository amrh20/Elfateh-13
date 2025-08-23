import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalItems = 0;
  subtotal = 0;
  discount = 0;
  total = 0;
  checkoutForm: FormGroup;
  isSubmitting = false;
  currentStep = 1; // Step 1: Cart Review, Step 2: Payment Details

  constructor(
    private cartService: CartService,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^01[0-2,5]{1}[0-9]{8}$/)]],
      deliveryAddress: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      additionalNotes: [''],
      paymentMethod: ['cash_on_delivery', Validators.required]
    });
  }

  ngOnInit(): void {
    // Scroll to top when component initializes
    this.viewportScroller.scrollToPosition([0, 0]);
    
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });

    // Reset form state to ensure no validation errors show initially
    this.resetFormState();
  }

  resetFormState(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsUntouched();
      control?.markAsPristine();
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

  async submitOrder(): Promise<void> {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const orderData = {
        customerInfo: {
          name: this.checkoutForm.value.fullName,
          email: 'customer@example.com', // You might want to add email field to the form
          phone: this.checkoutForm.value.mobileNumber,
          address: {
            street: this.checkoutForm.value.deliveryAddress,
            city: this.checkoutForm.value.city,
            // state: 'Cairo', // Cairo Governorate
            // zipCode: '11511', // Main Cairo postal code
            // country: 'Egypt'
          }
        },
        items: this.cartItems.map(item => ({
          product: item.product._id || item.product.id,
          quantity: item.quantity
        })),
        notes: this.checkoutForm.value.additionalNotes || 'No additional notes'
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      const response = await this.http.post(`${environment.apiUrl}/orders`, orderData, { headers }).toPromise();
      
      console.log('Order created successfully:', response);
      
      // Clear cart after successful order
      this.cartService.clearCart();
      
      // Show success message and redirect
      alert('تم إنشاء الطلب بنجاح!');
      this.router.navigate(['/']);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      this.isSubmitting = false;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method to check if a field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Step navigation methods
  goToStep(step: number): void {
    this.currentStep = step;
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  nextStep(): void {
    if (this.currentStep < 2) {
      this.currentStep++;
      this.viewportScroller.scrollToPosition([0, 0]);
      // Reset form validation state when moving to step 2
      this.resetFormState();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }

  canProceedToPayment(): boolean {
    return this.cartItems.length > 0;
  }
} 