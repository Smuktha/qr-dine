import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qr-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-viewer.component.html',
  styleUrls: ['./qr-viewer.component.css']
})
export class QrViewerComponent implements OnInit {
  tables: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.http.get<any[]>('https://qr-dine-backend-ek2s.onrender.com/api/tables')
      .subscribe({
        next: (data) => {
          this.tables = data;
          this.loading = false;
          console.log('✅ Tables loaded:', data);
        },
        error: (err) => {
          this.error = 'Failed to load tables. Make sure backend is running!';
          this.loading = false;
          console.error('❌ Error:', err);
        }
      });
  }

  downloadQR(table: any): void {
    if (table.qrCode) {
      const link = document.createElement('a');
      link.href = table.qrCode;
      link.download = `table-${table.tableNumber}-qr.png`;
      link.click();
      console.log(`📥 Downloaded QR for Table ${table.tableNumber}`);
    }
  }

  printQR(table: any): void {
    if (table.qrCode) {
      const printWindow = window.open();
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Table ${table.tableNumber} QR Code</title>
              <style>
                body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: white; }
                .container { text-align: center; }
                img { max-width: 500px; border: 2px solid #333; padding: 20px; }
                h1 { font-size: 48px; color: #333; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Table ${table.tableNumber}</h1>
                <img src="${table.qrCode}" alt="QR Code for Table ${table.tableNumber}" />
                <p style="font-size: 20px; margin-top: 20px;">Scan this QR code to place an order</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
      }
    }
  }

  copyLink(tableId: string, tableNumber: number): void {
    const link = `http://localhost:4200/order?tableId=${tableId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert(`✅ Link copied for Table ${tableNumber}!\n\n${link}`);
    });
  }
}
