import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  showPopup = false;
  orderPlaced = false;
  tableNumber: string = '';
  tableId: string = '';
  errorMessage = '';
  loading = false;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loading = true;
    // Get tableId directly from URL query params (set by QR code)
    this.route.queryParams.subscribe(params => {
      this.tableId = params['tableId'] || localStorage.getItem('tableId') || '';
      
      if (this.tableId) {
        console.log('✅ Table ID from QR:', this.tableId);
      } else {
        this.errorMessage = 'Invalid access. Please scan the table QR code.';
      }
      this.loading = false;
    });

    this.loadCart();
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  loadCart() {
    this.cartItems = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  increaseQuantity(index: number) {
    this.cartService.increaseQuantity(index);
  }

  decreaseQuantity(index: number) {
    this.cartService.decreaseQuantity(index);
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

  openPopup() {
    if (!this.tableId) {
      this.errorMessage = 'Table information not loaded. Please refresh the page.';
      return;
    }
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  placeOrder() {
    if (!this.tableId) {
      this.errorMessage = 'Table information missing!';
      return;
    }
    this.loading = true;
    this.cartService.placeOrder(this.tableId).subscribe({
      next: (response) => {
        console.log('✅ Order placed successfully:', response);
        this.orderPlaced = true;
        this.showPopup = false;
        this.cartService.clearCart();
        setTimeout(() => (this.orderPlaced = false), 3000);
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Order failed:', error);
        this.errorMessage = 'Failed to place order. Please try again.';
        this.loading = false;
      }
    });
  }
}