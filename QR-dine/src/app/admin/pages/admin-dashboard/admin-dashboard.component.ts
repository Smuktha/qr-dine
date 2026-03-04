import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MenuService, MenuItem } from '../../../services/menu.service';
import { OrderService, Order } from '../../../services/order.service';
import { Subscription } from 'rxjs';

interface Table {
  _id: string;
  tableNumber: number;
  qrCode: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  currentPage: string = 'orders'; // Default to orders page
  
  // Menu Items
  menuItems: MenuItem[] = [];
  newItem: MenuItem = { category: '', name: '', price: 0 };
  selectedFile: File | null = null;

  // Orders
  pendingOrders: Order[] = [];
  orderHistory: Order[] = [];
  
  // Tables & QR Codes
  tables: Table[] = [];
  newTableNumber: number | null = null;
  
  // Audio for notification
  private notificationSound: HTMLAudioElement;
  private orderSubscription?: Subscription;

  // Toast notification
  toastMessage = '';
  toastVisible = false;
  private toastTimer: any;

  constructor(
    private menuService: MenuService,
    private orderService: OrderService,
    private router: Router,
    private http: HttpClient
  ) {
    // Create notification sound
    this.notificationSound = new Audio();
    this.notificationSound.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZWQ0PVqzn77BiHAU7k9n0wnMnBSl+zO7cizYHG2m98OShUQ4QW7Lr7aFCCw==';
  }

  ngOnInit(): void {
    this.loadMenuItems();
    this.loadPendingOrders();
    this.loadOrderHistory();
    this.loadTables();
    
    // Subscribe to new orders
    this.orderSubscription = this.orderService.newOrder$.subscribe(order => {
      this.playNotificationSound();
      this.showToast('New order received!');
      this.loadPendingOrders(); // Refresh orders
    });
  }

  ngOnDestroy(): void {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  // Navigation
  navigate(page: string): void {
    this.currentPage = page;
    if (page === 'orders') {
      this.loadPendingOrders();
    } else if (page === 'history') {
      this.loadOrderHistory();
    } else if (page === 'manage') {
      this.loadMenuItems();
    } else if (page === 'qr-codes') {
      this.loadTables();
    }
  }

  // ===== ORDER MANAGEMENT =====
  loadPendingOrders(): void {
    this.orderService.getPendingOrders().subscribe({
      next: (orders) => {
        this.pendingOrders = orders;
      },
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  loadOrderHistory(): void {
    this.orderService.getOrderHistory().subscribe({
      next: (orders) => {
        this.orderHistory = orders;
      },
      error: (err) => console.error('Error loading history:', err)
    });
  }

  confirmOrder(order: Order): void {
    if (!order._id) return;
    this.orderService.confirmOrder(order._id).subscribe({
      next: () => {
        this.pendingOrders = this.pendingOrders.filter(o => o._id !== order._id);
        this.loadOrderHistory();
        this.showToast('✅ Order confirmed!');
      },
      error: (err) => {
        console.error('Error confirming order:', err);
        this.showToast('Failed to confirm order');
      }
    });
  }

  cancelOrder(order: Order): void {
    if (!order._id) return;
    if (!confirm('Are you sure you want to cancel this order?')) return;
    this.orderService.cancelOrder(order._id).subscribe({
      next: () => {
        this.pendingOrders = this.pendingOrders.filter(o => o._id !== order._id);
        this.loadOrderHistory();
        this.showToast('❌ Order cancelled!');
      },
      error: (err) => {
        console.error('Error cancelling order:', err);
        this.showToast('Failed to cancel order');
      }
    });
  }

  playNotificationSound(): void {
    this.notificationSound.play().catch(err => console.error('Could not play sound:', err));
  }

  // ===== MENU ITEM MANAGEMENT =====
  loadMenuItems(): void {
    this.menuService.getItems().subscribe({
      next: (data: MenuItem[]) => (this.menuItems = data),
      error: (err: any) => {
        console.error('Error loading items:', err);
        alert('Failed to load menu items.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  addItem(): void {
    if (!this.newItem.category || !this.newItem.name || this.newItem.price <= 0) {
      alert('⚠️ Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('category', this.newItem.category);
    formData.append('name', this.newItem.name);
    formData.append('price', this.newItem.price.toString());
    formData.append('description', this.newItem.description || '');
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.menuService.addItem(formData).subscribe({
      next: (item: MenuItem) => {
        this.menuItems.push(item);
        this.menuService.triggerRefresh();
        this.newItem = { category: '', name: '', price: 0 };
        this.selectedFile = null;
        alert('✅ Item added successfully!');
      },
      error: (err: any) => {
        console.error('Add failed:', err);
        alert('Failed to add item.');
      },
    });
  }

  deleteItem(item: MenuItem): void {
    if (!item._id) return;

    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    this.menuService.deleteItem(item._id).subscribe({
      next: () => {
        this.menuItems = this.menuItems.filter(i => i._id !== item._id);
        this.menuService.triggerRefresh();
        alert('🗑️ Item deleted successfully!');
      },
      error: (err: any) => {
        console.error('Delete failed:', err);
        alert('Failed to delete item.');
      },
    });
  }

  logout(): void {
    localStorage.removeItem('isAdminLoggedIn');
    this.router.navigate(['/admin-login']);
  }

  // ===== TABLE QR CODES =====
  loadTables(): void {
    this.http.get<Table[]>('https://qr-dine-backend-ek2s.onrender.com/api/tables').subscribe({
      next: (data) => {
        this.tables = data;
      },
      error: (err) => {
        console.error('Error loading tables:', err);
        alert('Failed to load tables. Make sure the backend is running!');
      }
    });
  }

  regenerateQRCodes(): void {
    if (!confirm('This will regenerate QR codes for all tables. Continue?')) return;

    this.http.post('https://qr-dine-backend-ek2s.onrender.com/api/tables/generate-qr', {}).subscribe({
      next: (response: any) => {
        alert(`✅ ${response.message}`);
        this.loadTables();
      },
      error: (err) => {
        console.error('Error regenerating QR codes:', err);
        alert('Failed to regenerate QR codes');
      }
    });
  }

  copyOrderLink(table: Table): void {
    const link = `${window.location.origin}/?tableId=${table._id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('✅ Order link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  }

  printQR(table: Table): void {
    if (!table.qrCode) {
      alert('QR code not available for this table');
      return;
    }

    const printWindow = window.open('', '', 'width=400,height=500');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Table ${table.tableNumber} QR Code</title>
            <style>
              body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
              .container { text-align: center; padding: 20px; }
              h1 { font-size: 24px; margin: 0 0 20px 0; }
              img { max-width: 300px; border: 2px solid #333; }
              p { margin-top: 20px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Table ${table.tableNumber}</h1>
              <img src="data:image/png;base64,${table.qrCode}" alt="QR Code" />
              <p>Scan to place an order</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  }

  deleteTable(table: Table): void {
    if (!confirm(`Delete Table ${table.tableNumber}? This cannot be undone.`)) return;

    this.http.delete(`https://qr-dine-backend-ek2s.onrender.com/api/tables/${table._id}`).subscribe({
      next: () => {
        this.tables = this.tables.filter(t => t._id !== table._id);
        alert('✅ Table deleted');
      },
      error: (err) => {
        console.error('Error deleting table:', err);
        alert('Failed to delete table');
      }
    });
  }

  addNewTable(): void {
    if (!this.newTableNumber || this.newTableNumber <= 0) {
      alert('⚠️ Please enter a valid table number');
      return;
    }

    this.http.post('https://qr-dine-backend-ek2s.onrender.com/api/tables', { tableNumber: this.newTableNumber }).subscribe({
      next: (newTable: any) => {
        this.tables.push(newTable);
        this.newTableNumber = null;
        alert(`✅ Table ${newTable.tableNumber} added with QR code!`);
      },
      error: (err) => {
        console.error('Error adding table:', err);
        console.error('Error details:', JSON.stringify(err.error, null, 2));
        // Backend returns { message: "...", error: "..." }
        const errorMsg = (err.error?.error || err.error?.message || err.message || '').toLowerCase();
        if (errorMsg.includes('already exists') || errorMsg.includes('already exist')) {
          alert('⚠️ Table number already exists! Please use a different table number.');
        } else {
          alert(`❌ Failed to add table: ${err.error?.error || err.error?.message || 'Unknown error'}`);
        }
      }
    });
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.toastVisible = true;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
      setTimeout(() => (this.toastMessage = ''), 400);
    }, 2500);
  }
}