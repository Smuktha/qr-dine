# QR-DINE QUICK START GUIDE
**Get running in 5 minutes!**

---

## ⚡ QUICK RUN INSTRUCTIONS

### **Terminal 1: Start Backend**
```powershell
cd c:\projects\QR-dine\qr-dine-backend
npm start
```
✅ Wait for: `🚀 Server running on port 5000`

### **Terminal 2: Start Frontend**
```powershell
cd c:\projects\QR-dine\QR-dine
npm start
```
✅ Frontend will open on available port (usually 4200 or 60920)

---

## 🎯 IMMEDIATE TESTING

### **Option 1: Test as Customer**
```
1. Go to: http://localhost:4200/
2. View menu items
3. Add item to cart
4. Go to cart page (or click cart icon)
5. Confirm order
```

### **Option 2: Test as Admin**
```
1. Go to: http://localhost:4200/admin
2. Login: admin / admin123
3. Click "Manage Menu" tab
4. Add a test dish (e.g., "Biryani", Main Course, ₹250)
5. Go back to home (customer view)
6. See the new dish appears instantly
```

### **Option 3: Test Full Order Flow**
```
Step 1: Add Menu Item (Admin)
  - Login to /admin
  - Go to Manage Menu
  - Add "Samosa" (Starters, ₹50)

Step 2: Place Order (Customer)
  - Go to http://localhost:4200/
  - Click "Add to Cart" for Samosa
  - Go to cart
  - Click "Confirm Order"

Step 3: Check Order (Admin)
  - Go to "Pending Orders" tab
  - See "Table 1 - Samosa x1 - ₹50"
  - Click "Confirm"
  - Order moves to "Order History"
```

---

## 🎮 LIVE URLS

| Page | URL | Purpose |
|------|-----|---------|
| Customer Home | http://localhost:4200/ | Browse menu |
| Customer Cart | http://localhost:4200/cart | Review order |
| Customer Order (from QR) | http://localhost:4200/order?tableId=... | Direct ordering |
| Admin Login | http://localhost:4200/admin-login | Admin entrance |
| Admin Dashboard | http://localhost:4200/admin | Full control |
| Backend API | http://localhost:5000/api/... | API endpoints |

---

## 🔑 CREDENTIALS

**Admin Login:**
- Username: `admin`
- Password: `admin123`

---

## 📊 TEST DATA

**Tables Created (Scan-Ready):**
- Table 1, 2, 3, 4, 5 (Each with unique QR code)

**Sample Menu Item:**
- Biryani - ₹250 (Main Course)

---

## ✨ KEY FEATURES TO TEST

✅ **Menu Management**
- Add dish → Appears on home immediately
- Delete dish → Disappears from customer view

✅ **Ordering**
- Add items → Cart updates in real-time
- Adjust quantities → Price updates instantly
- Confirm order → Success message appears

✅ **Admin Orders**
- New order notification → Sound plays
- Order shows table number + items
- Confirm/Cancel actions → Status changes

✅ **Real-time Updates**
- Customers see status updates
- Admins see new orders instantly
- No need to refresh pages

---

## 🐛 IF SOMETHING DOESN'T WORK

| Problem | Solution |
|---------|----------|
| Port already in use | Wait 5 min or use different port |
| MongoDB connection error | Check .env has correct connection string |
| Menu not showing | Admin must add items first |
| Order not appearing | Refresh admin page |
| Animation errors | Already fixed (check main.ts) |
| Image upload fails | /uploads folder exists |

---

## 📱 SIMULATE QR SCAN

Instead of scanning, use this URL directly:

```
http://localhost:4200/order?tableId=697b23a27984db44eccf91db
```

This will:
1. Open cart page
2. Automatically know it's for Table 1
3. Let customer add items
4. Send order with table identification

---

## 📂 PROJECT STRUCTURE REFERENCE

```
QR-Dine/
├── QR-dine/                          (Frontend - Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── customer/            (Customer pages)
│   │   │   ├── admin/               (Admin dashboard)
│   │   │   ├── cart.service.ts      (Order management)
│   │   │   └── app.routes.ts        (URL routing)
│   │   └── main.ts                  (App bootstrap)
│   └── package.json
│
└── qr-dine-backend/                 (Backend - Node.js)
    ├── server.js                    (Entry point)
    ├── config/db.js                 (MongoDB config)
    ├── controllers/                 (Business logic)
    │   ├── orderController.js
    │   ├── menuController.js
    │   └── tableController.js
    ├── models/                      (Data schemas)
    │   ├── Order.js
    │   ├── MenuItem.js
    │   └── Table.js
    ├── routes/                      (API endpoints)
    ├── uploads/                     (Menu images)
    ├── .env                         (Config)
    └── package.json
```

---

## 🎉 DONE!

You now have QR-Dine running with:
- ✅ Full customer ordering system
- ✅ Real-time admin dashboard
- ✅ Table identification
- ✅ Order tracking
- ✅ Menu management

**Start with Admin tab → Add a dish → See it appear on customer home → Place order → Confirm in admin → Order moves to history**

---

## 📖 FOR DETAILED INFO

- **Full Documentation**: See [QR-DINE_SYNOPSIS.md](QR-DINE_SYNOPSIS.md)
- **Testing Report**: See [QR_DINE_TESTING_REPORT.md](QR_DINE_TESTING_REPORT.md)
- **User Guide**: See [USER_GUIDE.md](USER_GUIDE.md)

---

**Last Updated**: January 29, 2026  
**Status**: ✅ Ready to Deploy

