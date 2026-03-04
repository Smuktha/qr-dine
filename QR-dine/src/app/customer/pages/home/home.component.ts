import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../cart.service';
import { MenuService, MenuItem } from '../../../services/menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('zoomInOut', [
      transition('zoomed => normal', [
        animate('1.8s ease', keyframes([
          style({ transform: 'scale(0.8)', opacity: 0, offset: 0 }),
          style({ transform: 'scale(1.2)', opacity: 1, offset: 0.4 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private cartService: CartService,
    private menuService: MenuService
  ) {}

  searchText: string = '';
  selectedCategory: string = 'All';
   isLoading: boolean = true;
  errorMessage: string = '';

  // 🎞️ slideshow
  foodImages: string[] = [
    'assets/hero/hero1.png',
    'assets/hero/hero2.png',
    'assets/hero/hero3.png'
  ];
  currentImageIndex = 0;
  private slideTimer: any;

  // 📂 categories
  categories = [
    { name: 'All', image: 'assets/products/chicken-lolipop.jpg' },
    { name: 'Starters', image: 'assets/categories/starters.jpg' },
    { name: 'Main Course', image: 'assets/categories/maincourse.jpg' },
    { name: 'Desserts', image: 'assets/categories/desserts.jpg' },
    { name: 'Beverages', image: 'assets/categories/bevarages.jpg' },
    { name: 'Snacks', image: 'assets/categories/snacks.jpg' }
  ];

  // 🍴 products - now empty, will be loaded from backend only
  products: MenuItem[] = [];
  filteredProducts: MenuItem[] = [];

  cart: { name: string; price: number; image?: string; qty: number }[] = [];
  animationState: 'normal' | 'zoomed' = 'zoomed';
  private refreshSub!: Subscription;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tableId = params['tableId'];
      if (tableId) {
        localStorage.setItem('tableId', tableId);
      }
    });

    // start slideshow
    this.slideTimer = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.foodImages.length;
    }, 3000);

    // trigger hero animation
    setTimeout(() => {
      this.animationState = 'normal';
    }, 900);

    // 🔹 Load backend menu items
    this.loadMenuItems();

    // 🔹 Subscribe to admin updates
    this.refreshSub = this.menuService.refreshNeeded.subscribe(() => {
      console.log('🔄 Menu auto-refresh triggered!');
      this.loadMenuItems();
    });
  }

  ngOnDestroy() {
    if (this.slideTimer) clearInterval(this.slideTimer);
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

 loadMenuItems() {
    this.isLoading = true;
    this.errorMessage = '';
    this.menuService.getItems().subscribe({
      next: (items) => {
        this.products = items.map(item => ({
          ...item,
          imageUrl: item.image ? `https://qr-dine-backend-ek2s.onrender.com/uploads/${item.image}` : undefined
        }));

        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load menu items:', err);
        this.errorMessage = 'Failed to load menu items. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onExploreMenu() {
    document.querySelector('.category-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const matchCategory = this.selectedCategory === 'All' || p.category === this.selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(this.searchText.toLowerCase());
      return matchCategory && matchSearch;
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

addToCart(product: any) {
  // Ensure product has all required fields including image
  const itemToAdd = {
    ...product,
    _id: product._id,
    image: product.imageUrl || product.image, // Use imageUrl if available
    imageUrl: product.imageUrl, // Keep imageUrl for cart display
    quantity: 1
  };
  
  this.cartService.addItem(itemToAdd);
  alert(`${product.name} added to cart!`);
}

  goToCart() {
    const tableId = localStorage.getItem('tableId');
    this.router.navigate(['/cart'], tableId ? { queryParams: { tableId } } : undefined);
  }
}