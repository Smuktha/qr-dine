import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'QR-dine';

  constructor(private router: Router) {}

  goToCart() {
    const tableId = localStorage.getItem('tableId');
    if (tableId) {
      this.router.navigate(['/cart'], { queryParams: { tableId } });
    } else {
      this.router.navigate(['/cart']);
    }
  }

  goToHome() {
    const tableId = localStorage.getItem('tableId');
    if (tableId) {
      this.router.navigate(['/'], { queryParams: { tableId } });
    } else {
      this.router.navigate(['/']);
    }
  }
}
